import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { DataDto } from 'src/app/types/data.dto';
import { GroupDto } from 'src/app/types/group.dto';

@Component({
  selector: 'app-group-selection',
  templateUrl: './group-selection.component.html',
  styleUrls: ['../common/common.styles.css', './group-selection.component.css']
})
export class GroupSelectionComponent implements OnInit {
  dataGroups: DataDto<GroupDto>[] = [];

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.apiService.getGroups()
    .then((result) => {
      this.dataGroups = result.data
    })
    .catch((error) => {
      console.log(`Error in GroupSelectionComponent: ${error}`); 
      this.router.navigate(['/login']);
    })
  }

  goToGroup(groupId: number, groupTitle: string): void {
    const url = `/group/${groupId}`;
    this.router.navigateByUrl(url, { state: { title: groupTitle } });
  }
} 
