import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { HttpService } from '../shared/http.service';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  task: Task;
  tasks: Task[] = [];
  taskForm: FormGroup;
  showTaskForm = false;
  isEdit = false;
  message = null;

  constructor(private httpService: HttpService, private fb: FormBuilder) { }

  ngOnInit() {
    this.task = new Task();
    this.httpService.getTasks().subscribe(
      (tasks: Task[]) => this.tasks = tasks
    );
  }

  onDelete(name: string) {
    confirm('Do you want to delete the task?');
    this.httpService.deleteTask( name ).subscribe(
      (response: Response) => {
        console.log(response);
        this.showTransactionMessage('Deleted successfully!');
        this.httpService.getTasks().subscribe(
          (tasks: Task[]) => this.tasks = tasks
        );
      },
      (error) => this.showTransactionMessage(error)
    );
  }

  onUpdate(name: string) {
    this.httpService.getTaskByName(name).subscribe(
      (taskData: Task) => {
        this.task = taskData;
        this.onAddTaskRow();
        this.taskForm.patchValue(this.task);
        this.isEdit = true;
      }
    );
  }

  onAddTaskRow() {
    this.taskForm = this.buildForm();
    this.showTaskForm = true;
    this.isEdit = false;
  }

  buildForm() {
    return this.fb.group({
      'title': this.fb.control(null, [Validators.required]),
      'description': this.fb.control(null, [Validators.required])
    });
  }

  onSubmit() {
    this.task.title = this.taskForm.get('title').value;
    this.task.description = this.taskForm.get('description').value;

    let transactionObservable = this.httpService.addTask( this.task );
    if ( this.isEdit ) {
      transactionObservable = this.httpService.updateTask( this.task.name, this.task );
    }

    transactionObservable.subscribe(
      (response: Response) => {
        this.showTaskForm = false;
        this.taskForm = null;
        this.isEdit = false;
        console.log(response);
        this.showTransactionMessage('Added/Updated successfully!');
        this.httpService.getTasks().subscribe(
          (tasks: Task[]) => this.tasks = tasks
        );
      },
      (error) => this.showTransactionMessage(error)
    );
  }

  showTransactionMessage( message: string ) {
    this.message = message;
    setTimeout(
      () => this.message = null,
      3000
    );
  }

}
