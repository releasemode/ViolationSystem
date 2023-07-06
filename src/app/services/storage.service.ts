import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  getString(key: string) {
    return localStorage.getItem(key);
  }

  setString(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  getObject(key: string) {
    let data: any;
    if (key in localStorage) {  //check if key exixt or not
      let encodedData:any = localStorage.getItem(key);
      data = JSON.parse(atob(encodedData))  //decode
      return data;
    } else {
      data = {};
      return data;
    }
  }

  setObject(key: string, data: object) {
    let value: string = btoa(JSON.stringify(data));
    localStorage.setItem(key, value);
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}
