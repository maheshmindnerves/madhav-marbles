import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    setItem(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    getItem(key: string) {
        const val = localStorage.getItem(key);
        if (!val) {
            return null;
        }
        try {
            return JSON.parse(val);
        } catch (e) {
            return val;
        }
    }

    removeItem(key: string) {
        localStorage.removeItem(key);
    }
}