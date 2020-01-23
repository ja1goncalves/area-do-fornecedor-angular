import * as moment from 'moment';
import { IMyDpOptions } from "mydatepicker";

export function eraseCookie(...name): any {
  name.forEach(e => {
    document.cookie = `${e}=123;max-age=0;`;
  });
}


export function getObjectCookie(cname): any {
  const cookie = getCookie(cname);
  return cookie ? JSON.parse(cookie) : undefined;
}


export function getCookie(cname): string {
  const name = cname + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}


export function formatdate(date: any): string {
  return moment(date).format('DD/MM/YYYY');
}


export function cleanCookie(): void {

  localStorage.clear();
  window.localStorage.clear();

  document.cookie = 'token';
  document.cookie = 'user_data';

  alert('Os cookies foram limpos com sucesso. Tente entrar no sistema novamente!');

  location.reload(!0);

}

export const defaultReqErrMessage = 'Aconteceu um erro no servidor. Por favor, tente mais tarde.';

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
