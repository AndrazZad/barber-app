import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BarbersService } from '../../data/services/barbers.service';
import { Appointment, Barber, ProstTermin, Service, WorkHour, LunchTime } from '../../data/classes/barber.model';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { app } from '../../../../server';
import { Package } from '../../data/classes/package.model';
import { response } from 'express';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';



@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {

  barbers: Barber[] = [];
  selectedBarber: string = ''; 
  services: Service[] = [];
  selectedService: string = '';
  appointments: Appointment[] = [];
  prostiTermini: ProstTermin[] = [];
  trenutniBarber!: Barber;
  selectedDate!: Date;
  trenutniProstiIntervali: ProstTermin[] = [];
  selectedTime!: Date; 
  myForm: FormGroup;
  formSubmitted: boolean = false;

  

  constructor(private barberService: BarbersService, private datePipe: DatePipe, private router: Router, private formBuilder: FormBuilder) {
    // Initialize form and set up validators
    this.myForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]], 
      number: ['', [Validators.required, this.slovenePhoneNumberValidator]], 
    });
  }
  
  // Custom validator function for Slovene phone number
  slovenePhoneNumberValidator(control: FormControl): { [key: string]: any } | null {
    const slovenePhoneNumberPattern = /^(\+386)[1-9]\d{6,7}$/;
  
    if (control.value && !slovenePhoneNumberPattern.test(control.value)) {
      return { 'slovenePhoneNumber': true }; 
    }
  
    return null; 
  }

  ngOnInit(): void {

    // pridobitev podatkov 
    this.barberService.getBarbers().subscribe((data: Barber[]) => {
      this.barbers = data;
      
    });

    this.barberService.getServices().subscribe((data: Service[]) => {
      this.services = data;
    });

    this.barberService.getAppointments().subscribe((data: Appointment[]) => {
      
      this.appointments = data.map((appointment: Appointment) => ({
        ...appointment,
        startDate: new Date((appointment.startDate as unknown as number) * 1000),
      }));
      
      

      
    });
    
    console.log(this.selectedTime);
    //tabela dovoljenih ur za rezervacijo
    // samo med delovnimi urami
    // brez overlapanja z prejsnimi appointmentsi
    // appointments have different duration
    // pokazi samo dovoljene
  }

  get email() {
    return this.myForm.get('email') as FormControl;
  }

  get number() {
    return this.myForm.get('number') as FormControl;
  }

  get firstName(): FormControl{
    return this.myForm.get('firstName') as FormControl;
  }

  get lastName(): FormControl {
    return this.myForm.get('lastName') as FormControl;
  }

  get barber(): FormControl {
    return this.myForm.get('barber') as FormControl;
  }

  

  getPickedBarberId(): void {
    console.log("getPickedBarbeIdCall");
    // Find the selected barber in the array based on the name
    const selectedBarber = this.barbers.find(barber => barber.id === this.selectedBarber);
    
    this.trenutniBarber = selectedBarber as Barber;
    //console.log(this.trenutniBarber);

    this.updateajIzbireTerminovGledeNaStoritev();
    
    
  }

  mozneUre(): void {
    console.log("mozneUre");

    // izberi datum

    // poglej ker dan je pon = day 1

    if (this.selectedDate) {
      // Log the selected date
      //console.log('Selected Date:', this.selectedDate);

      // Log the day of the week
      const dayOfWeek = this.datePipe.transform(this.selectedDate, 'EEEE');
      //console.log('Day of the Week:', dayOfWeek);

      // Assign a numeric value based on the day of the week
      let numericDayOfWeek: number;

      if (dayOfWeek === 'Monday') {
        numericDayOfWeek = 1;
      } else if (dayOfWeek === 'Tuesday') {
        numericDayOfWeek = 2;
      } else if (dayOfWeek === 'Wednesday') {
        numericDayOfWeek = 3;
      } else if (dayOfWeek === 'Thursday') {
        numericDayOfWeek = 4;
      } else if (dayOfWeek === 'Friday') {
        numericDayOfWeek = 5;
      } else if (dayOfWeek === 'Saturday') {
        numericDayOfWeek = 6;
      } else if (dayOfWeek === 'Sunday') {
        numericDayOfWeek = 7;
      } else {
        // Handle unknown day of the week
        numericDayOfWeek = -1;
      }

      //array for intevals
      let vmesna: ProstTermin[] = [];
      
      // poglej workhours za izbran dan
      if(this.trenutniBarber != undefined) {
      
        const workHoursForSelectedDay = this.trenutniBarber.workHours.filter(hour => hour.day === numericDayOfWeek);
        //console.log('Work Hours for Selected Day:', workHoursForSelectedDay);
      
      
        workHoursForSelectedDay.forEach(workHour => {
          // Check if the current workHour has lunchTime
          if (workHour.lunchTime) {
            // Use the selected date to create Date objects
            let date = new Date(this.selectedDate);
            let year = date.getFullYear();
            let month = date.getMonth();
            let day = date.getDate();
        
            // Set hours, minutes, and seconds for the new dates
            const startHourDate = new Date(year, month, day, workHour.startHour);
            const lunchStartHourDate = new Date(year, month, day, workHour.lunchTime.startHour);
            const lunchEndHourDate = new Date(year, month, day, workHour.lunchTime.startHour, workHour.lunchTime.durationMinutes);
            const endHourDate = new Date(year, month, day, workHour.endHour);
        
            const a = new ProstTermin(startHourDate, lunchStartHourDate);
            const b = new ProstTermin(lunchEndHourDate, endHourDate);
        
            // Add the calculated intervals to freeTimeIntervals
            //replaced this.prostiTermini with vmesna
            vmesna.push(a, b);
          }
        });
        
      
        
        // odstej appointments

        this.appointments.forEach(appointment => {
          
          let prvi = new Date(appointment.startDate);
          let drugi = new Date(this.selectedDate);
    

          if (prvi.getDate() === drugi.getDate() && prvi.getMonth() === drugi.getMonth() && prvi.getFullYear() === drugi.getFullYear()) {
            //console.log(appointment);
            const appointmentStartDate = new Date(appointment.startDate);
            let appointmentEndDate: Date;
        
            if (appointment.serviceId === 1) {
              appointmentEndDate = new Date(appointmentStartDate.getTime() + 15 * 60 * 1000);
            } else if (appointment.serviceId === 2) {
              appointmentEndDate = new Date(appointmentStartDate.getTime() + 20 * 60 * 1000);
            } else if (appointment.serviceId === 3) {
              appointmentEndDate = new Date(appointmentStartDate.getTime() + 30 * 60 * 1000);
            }

            const updatedProstiTermini: ProstTermin[] = [];

            //replaced this.prostiTermini with vmesna
            vmesna.forEach(interval => {
              //console.log(interval);
              const intervalStartDate = interval.zacetek;
              const intervalEndDate = interval.konec;

              // Check if the intervals overlap
              if (appointmentEndDate > intervalStartDate && appointmentStartDate < intervalEndDate) {
                // Split the overlapping interval into two new intervals
                if (appointmentStartDate > intervalStartDate) {
                  updatedProstiTermini.push(new ProstTermin(intervalStartDate, appointmentStartDate));
                }
                if (appointmentEndDate < intervalEndDate) {
                  updatedProstiTermini.push(new ProstTermin(appointmentEndDate, intervalEndDate));
                }
              } else {
                updatedProstiTermini.push(interval);
              }
            });

            // Update prostiTermini with the modified array
            vmesna = updatedProstiTermini;
        
            // Now you can use appointmentEndDate as needed
          }
        });

        this.prostiTermini = [...vmesna];
      }
        
       

    } else {
      console.log('No date selected.');
    }

  }

  updateajIzbireTerminovGledeNaStoritev() : void {
    console.log("update storitev Call");
    //console.log(this.selectedService);

    
    if(this.selectedService != "") {
        this.mozneUre();

        
        const availableTimeIntervals: ProstTermin[] = [];
    
        // Define the duration based on the selected service
        const durationMinutes = this.selectedService === "1" ? 15 : (this.selectedService === '2' ? 20 : 30);
    
        // Iterate through the original prostiTermini
        this.prostiTermini.forEach(interval => {
          //console.log(interval);
          const intervalStart = new Date(interval.zacetek);
          let intervalEnd = new Date(intervalStart.getTime() + durationMinutes * 60 * 1000);
    
          // Ensure the interval end does not exceed the konec time
          const maxIntervalEnd = new Date(Math.min(intervalEnd.getTime(), interval.konec.getTime()));
    
          // Create ProstTermin objects with the sliced time interval
          const newInterval = new ProstTermin(new Date(intervalStart), maxIntervalEnd);
    
           // Add the sliced interval to the array of available time intervals if it meets the duration requirement
          if (maxIntervalEnd.getTime() - intervalStart.getTime() >= durationMinutes * 60 * 1000) {
            availableTimeIntervals.push(newInterval);
          }
    
          // If the interval has remaining time, create additional sliced intervals
          while (intervalEnd < interval.konec) {
            const newIntervalStart = new Date(intervalEnd);
            const newIntervalEnd = new Date(newIntervalStart.getTime() + durationMinutes * 60 * 1000);
    
            // Ensure the additional interval end does not exceed the konec time
            const maxNewIntervalEnd = new Date(Math.min(newIntervalEnd.getTime(), interval.konec.getTime()));
    
            // Create ProstTermin objects with the additional sliced time interval
            const additionalInterval = new ProstTermin(new Date(newIntervalStart), maxNewIntervalEnd);
    
            // Add the additional sliced interval to the array of available time intervals if it meets the duration requirement
            if (maxNewIntervalEnd.getTime() - newIntervalStart.getTime() >= durationMinutes * 60 * 1000) {
              availableTimeIntervals.push(additionalInterval);
            }
    
            // Update intervalEnd for the next iteration
            intervalEnd = maxNewIntervalEnd;
          }
          //console.log(interval);
          console.log(this.prostiTermini);
        });
    
    
        // Assign the new array to trenutniProstiIntervali to avoid unintended side effects
        this.trenutniProstiIntervali = [...availableTimeIntervals];
    
        //console.log(this.trenutniProstiIntervali);
      } else {
        console.log("no selected service");
      }


  }
  
  calculatePrice(): string {
    if (this.selectedService == "1") {
      return 'Price is 15€';
    } else if (this.selectedService == "2") {
      return 'Price is 20€';
    } else if (this.selectedService == "3") {
      return 'Price is 30€';
    } else {
      return ''; // Handle other cases or return a default value
    }
  }
 

 

  submitForm() {

    if (this.myForm.valid && this.selectedTime != undefined) {
      // Handle form submission
      console.log(this.selectedTime);
      
      const unixTimestamp = new Date(this.selectedTime).getTime() / 1000;
      console.log(unixTimestamp);
      
      const packageData: Package = {
        id: (this.appointments.length + 1).toString(),
        startDate: unixTimestamp,
        barberId: parseInt(this.selectedBarber, 10),
        serviceId: parseInt(this.selectedService, 10),
  
      }
      
      this.barberService.postAppointment(packageData).subscribe(
        (response) => {
          console.log('Appointment created successfully!', response);
  
          // Navigate to the success page after a successful booking
          this.router.navigate(['/success']);
        },
        (error) => {
          console.error('Error creating appointment:', error);
        }
      );
  
      
  
      console.log('Form submitted!');
    } else {
      // Form is invalid, display errors or take necessary action
      this.formSubmitted = true;
      
    }


  }

  

}

