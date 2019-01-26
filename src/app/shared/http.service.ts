import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Task } from '../models/task.model';

@Injectable()
export class HttpService {

  tasks: Task[] = [];

  constructor(private http: Http) { }

  getTasks(): Observable<Task[]> {
    return this.http.get('https://firestore.googleapis.com/v1beta1/projects/angular-task-e7f39/databases/(default)/documents/tasks').pipe(
      map((response: Response) => {
        const data = response.json();
        this.tasks = [];
        data.documents.forEach(task => {
          // task.name = task.name.replace('projects/angular-task-e7f39/databases/(default)/documents/tasks/', '');
          this.tasks.push({
            name: task.name,
            title: task.fields.title.stringValue,
            description: task.fields.description.stringValue
          });
        });
        return this.tasks;
      })
    );
  }

  getTaskByName(name: string): Observable<Task> {
    return this.http.get('https://firestore.googleapis.com/v1beta1/' + name).pipe(
      map(
        (response: Response) => {
          const data = response.json();
          const task: Task = {
            name: data.name,
            title: data.fields.title.stringValue,
            description: data.fields.description.stringValue
          };
          return task;
        }
      )
    );
  }

  updateTask(name: string, task: Task): Observable<any> {
    return this.http.patch('https://firestore.googleapis.com/v1beta1/' + name, this.prepareRequestBody(task));
  }

  deleteTask(name: string): Observable<any> {
    return this.http.delete('https://firestore.googleapis.com/v1beta1/' + name);
  }

  addTask(task: Task): Observable<any> {
    return this.http.post('https://firestore.googleapis.com/v1beta1/projects/angular-task-e7f39/databases/(default)/documents/tasks', this.prepareRequestBody(task));
  }

  prepareRequestBody(task: Task) {
    return {
      'fields': {
        'title': {
          'stringValue': task.title
        },
        'description': {
          'stringValue': task.description
        }
      }
    };
  }
}
