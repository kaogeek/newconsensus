import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

export interface CareerGroup {
    name: string;
}

@Component({
    selector: 'autocomp-career',
    templateUrl: './AutoCompCareer.component.html'
})
export class AutoCompCareer implements OnInit {
    careerForm = new FormControl();

    careerGroups: CareerGroup[] =  [ 
    { name: 'เกษตรกร/ทำสวน/ทำไร่'},
    { name: 'ข้าราชการ/พนักงานของรัฐ/รัฐวิสาหกิจ'},
    { name: 'มัธยมศึกษาตอนปลายหรือเทียบเท่า'},
    { name: 'นักการเมืองระดับชาติ/ระดับท้องถิ่น'},
    { name: 'นิสิต/นักศึกษา'},
    { name: 'ว่างงาน'}
    ];

    careerGroupOptions: Observable<CareerGroup[]>;

    constructor(private _formBuilder: FormBuilder) { }

    public ngOnInit() {
        this.careerGroupOptions = this.careerForm.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this._filter(name) : this.careerGroups.slice())
          );
      }
    
      displayFn(career: CareerGroup): string {
        return career && career.name ? career.name : '';
      }
    
      private _filter(name: string): CareerGroup[] {
        const filterValue = name.toLowerCase();
    
        return this.careerGroups.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
      }
      public setValueCareer(career: string) {
        this.careerForm.setValue({name: career});
      }
}
