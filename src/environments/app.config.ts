import {Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppConfig {

    private config: Object = null;
    private env: Object = null;

    constructor(private http: HttpClient) {
    }

    getHttp(): HttpClient {
        return this.http;
    }

    /**
     * Use to get the data found in the second file (config file)
     */
    public getConfig(key: any) {
        return this.config[key];
    }

    /**
     * Use to get the data found in the first file (env file)
     */
    public getEnv(key: any) {
        return this.env[key];
    }

    /**
     * This method:
     *   a) Loads "env.json" to get the current working environment (e.g.: 'production', 'development')
     *   b) Loads "config.[env].json" to get all env's variables (e.g.: 'config.development.json')
     */
    public load() {
        return new Promise((resolve, reject) => {
            this.http.get('./assets/config/proxy.config.json').pipe(
                map(res => res)).pipe(catchError((error: any): any => {
                resolve(true);
                return Observable.throw(error.json().error || 'Server error');
            }))
                .subscribe((envResponse) => {
                    this.env = envResponse;
                    const request: any = null;
                    if (request) {
                        request
                            .map(res => res.json())
                            .catch((error: any) => {
                                resolve(error);
                                return Observable.throw(error.json().error || 'Server error');
                            })
                            .subscribe((responseData) => {
                                this.config = responseData;
                                resolve(true);
                            });
                    } else {
                        resolve(true);
                    }
                });

        });
    }
}
