import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { PeriodicElement } from 'src/app/models/PeriodicElement';
import { PeriodicElementService } from 'src/app/services/PeriodicElement.service';
import { ElementDialogComponent } from 'src/app/shared/element-dialog/element-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [PeriodicElementService]
})
export class HomeComponent implements OnInit {
  @ViewChild(MatTable)
  table!: MatTable<any>;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];
  dataSource!: PeriodicElement[];

  constructor(
    public dialog: MatDialog,
    public periodicElementService: PeriodicElementService) {
    this.periodicElementService.getElements()
      .subscribe((data: PeriodicElement[]) => {
        console.log(data);
        this.dataSource = data;
      })
  }

  ngOnInit(): void {
    this.periodicElementService.getElements()
      .subscribe((data: PeriodicElement[]) => {
        this.dataSource = data;
      })
  }

  openDialog(element: PeriodicElement | null): void {
    const dialogRef = this.dialog.open(ElementDialogComponent, {
      width: '250px',
      data: element === null ? {
        position: null,
        name: '',
        weight: null,
        symbol: ''
      } : {
        id: element.id,
        position: element.position,
        name: element.name,
        weight: element.weight,
        symbol: element.symbol
      }

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (this.dataSource.map(p => p.id).includes(result.id)) {
          this.periodicElementService.createElement(result)
            .subscribe((data: PeriodicElement) => {
              const index = this.dataSource.findIndex(p => p.id === data.id);
              this.dataSource[index] = data;
              this.table.renderRows();
            })
        } else {
          this.periodicElementService.createElement(result)
            .subscribe((data: PeriodicElement) => {
              this.dataSource.push(data);
              this.table.renderRows();
            })
        }
      }
    });
  }

  deleteElement(position: number): void {
    this.periodicElementService.deleteElement(position)
      .subscribe(() => {
        this.dataSource = this.dataSource.filter(p => p.id !== position);
      })
  }

  editElement(element: PeriodicElement): void {
    this.openDialog(element);
  }
}