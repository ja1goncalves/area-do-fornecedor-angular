import { Component, OnInit } from '@angular/core';
import { EmissionService } from 'src/app/services/emission/emission.service';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IEmission } from './interfaces';
import { AuthService } from '../../../services/auth/auth.service'
import {formatdate} from '../../../app.utils'

@Component({
  selector: 'app-emissions',
  templateUrl: './emissions.component.html',
  styleUrls: ['./emissions.component.css']
})
export class EmissionsComponent implements OnInit {
  emissions: IEmission[] = [];
  loading: any = true;
  formatDate: any = undefined;
  // format: useref formatdate;

  // form: (e) => formatdate(e);

  /**
   * @description Formulário pai de todos
   * Dentro dele há formulário criados dinamicamente seguindo o padrâo:
   * programsForm {
   *    emissionGroup {
   *        programForm // Este é o formulário de cada campo
   *    }
   * }
   */
  programsForm: FormGroup;

  constructor(
    private authService: AuthService,
    private emissionService: EmissionService,
    private notify: NotifyService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.programsForm = this.fb.group({});
    this.getEmissions();
    this.formatDate = formatdate;
  }

  public getEmissions(): void {
    this.loading = true;

    this.emissionService.getEmissions(this.authService.getDataUser().cpf)
      .subscribe(({ data }) => {
        this.emissions = data;
        for (const emission of this.emissions) {
          this.programsForm.addControl(`emis-group-${emission.id}`, this.fb.group({}));
        }
        this.loading = false;
      }, err => {
        this.loading = false;
      })
      ;
  }

  public saveFidelities(emisId: number): void {
    const emisGroup = this.programsForm.get(`emis-group-${emisId}`) as FormGroup;
    if (emisGroup.invalid) {
      this.notify.show('error', 'Alguns campos estão com erro, por favor os verifique.');
      Object.values(emisGroup.controls).forEach((group: FormGroup) => {
        Object.values(group.controls).forEach((control: FormControl) => {
          control.markAsTouched();
        });
      });
      return;
    }

    this.loading = true;
  }
}
