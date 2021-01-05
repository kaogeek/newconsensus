import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

export interface EducationGroup {
  name: string;
}
@Component({
  selector: 'autocomp-edication',
  templateUrl: './AutoCompEducation.component.html'
})
export class AutoCompEducation implements OnInit {
  educationForm = new FormControl();

  educationGroups: EducationGroup[] = [
    { name: 'ประถมศึกษา' },
    { name: 'มัธยมศึกษาตอนต้นหรือเทียบเท่า' },
    { name: 'มัธยมศึกษาตอนปลายหรือเทียบเท่า' },
    { name: 'ปริญญาตรี' },
    { name: 'ปริญญาโท' },
    { name: 'สูงกว่าปริญญาโท' },
    // { name: 'อื่นๆ (โปรดระบุ) ......'}
  ];

  educationOptions: Observable<EducationGroup[]>;

  public ngOnInit() {
    this.educationOptions = this.educationForm.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.educationGroups.slice())
      );
  }

  displayFn(education: EducationGroup): string {
    return education && education.name ? education.name : '';
  }

  private _filter(name: string): EducationGroup[] {
    const filterValue = name.toLowerCase();

    return this.educationGroups.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
  public setValueEducation(education: string) {
    this.educationForm.setValue({name: education});
  }
}
