
  export class Barber {
    constructor(
      public id: string,
      public firstName: string,
      public lastName: string,
      public workHours: WorkHour[]
    ) {}
  }
  
  export class LunchTime {
    constructor(
      public startHour: number,
      public durationMinutes: number,
    ) {}
      
    
  }
  
  export class WorkHour {
    constructor(
      public id: number,
      public day: number,
      public startHour: number,
      public endHour: number,
      public lunchTime: LunchTime,
      ) {}
    
  }

  export class Service {
    constructor(
      public id: number,
      public name: String,
      public durationMinutes: number,
      public price: number,
    ) {}
  }

  export class Appointment {
    constructor(
      public id: number,
      public startDate: Date,
      public barberId: number,
      public serviceId: number,
    ) {}
  }

  export class ProstTermin {
    constructor(
      public zacetek: Date,
      public konec: Date,
    ) {}
  }
  