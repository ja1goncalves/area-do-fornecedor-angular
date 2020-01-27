import * as moment from 'moment';
import { IMyDpOptions } from "mydatepicker";
import { AbstractControl } from "@angular/forms";

export const invalidFormMessage = 'Há dados inválidos. Por favor, verifique os campos em vermelho.';

export const validateCpf = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;

export const datePickerOpts: IMyDpOptions = {
  minYear: moment().year() - 150,
  maxYear: moment().year(),
  showTodayBtn: false,
  markCurrentDay: false,
  openSelectorOnInputClick: true,
  inline: false,
  editableDateField: false,
  dayLabels: {
    su: "Dom",
    mo: "Seg",
    tu: "Ter",
    we: "Qua",
    th: "Qui",
    fr: "Sex",
    sa: "Sáb"
  },
  monthLabels: {
    1: "Jan",
    2: "Fev",
    3: "Mar",
    4: "Abr",
    5: "Mai",
    6: "Jun",
    7: "Jul",
    8: "Ago",
    9: "Set",
    10: "Out",
    11: "Nov",
    12: "Dez"
  },
  dateFormat: "dd/mm/yyyy",
  todayBtnTxt: "Hoje",
  sunHighlight: false
};

/**
 * @description Checks if the control have the Validator.required
 * @param {AbstractControl} abstractControl 
 */
export const hasRequiredField = (abstractControl: AbstractControl): boolean => {
  if (abstractControl.validator) {
      const validator = abstractControl.validator({}as AbstractControl);
      if (validator && validator.required) {
          return true;
      }
  }
  if (abstractControl['controls']) {
      for (const controlName in abstractControl['controls']) {
          if (abstractControl['controls'][controlName]) {
              if (hasRequiredField(abstractControl['controls'][controlName])) {
                  return true;
              }
          }
      }
  }
  return false;
};
