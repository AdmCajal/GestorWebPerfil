import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { ComponenteBasePrincipal } from '../../../util/ComponenteBasePrincipa';
import { IeCommerceItem } from './Ie-commerce-item.metadata';


@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
  styleUrls: ['./e-commerce.component.scss']
})
export class ECommerceComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy {
  timeSlide;
  timerSlide: any;
  slide: Subject<any> = new Subject();
  @Input() height = 550;
  @Input() isFullScreen = false;
  items: IeCommerceItem[] =
  [
    {
      id: 1,
      title: {
        first: '',
        second: ''
      },
      subtitle: '',
      link: '/',
      image: 'assets/images/preCar0.png'
    },
    {
      id: 2,
      title: {
        first: '',
        second: ''
      },
      subtitle: '',
      link: '/',
      image: 'assets/images/preCar1.png'
    },
    {
      id: 3,
      title: {
        first: '',
        second: ''
      },
      subtitle: '',
      link: '/',
      image: 'assets/images/preCar2.png'
    },
    {
      id: 4,
      title: {
        first: '',
        second: ''
      },
      subtitle: '',
      link: '/',
      image: 'assets/images/preCar3.png'
    },
    {
      id: 5,
      title: {
        first: '',
        second: ''
      },
      subtitle: '',
      link: '/',
      image: 'assets/images/preCar4.png'
    }
  ];


  public finalHeight: string | number = 0;
  public currentPosition = 0;

  constructor() {
    super(
    );
    this.finalHeight = this.isFullScreen ? '100vh' : `${this.height}px`;
  }

  ngOnDestroy(): void {
    this.slide.unsubscribe();
  }

  ngOnInit(): void {
    this.items.map((i, index) => {
      i.id = index;
      i.marginLeft = 0;
    });

    this.checkTimeSlide();
    this.slide.subscribe(() => {
      this.timerSlide = setInterval(() => this.setNext(), 3000)
    })


  }

  checkTimeSlide() {
    this.timeSlide = setTimeout(() => this.slide.next(), 1000);
  }

  setCurrentPosition(position: number) {
    this.currentPosition = position;
    this.items.find(i => i.id === 0).marginLeft = -100 * position;
  }

  setNext() {
    let finalPercentage = 0;
    let nextPosition = this.currentPosition + 1;
    if (nextPosition <= this.items.length - 1) {
      finalPercentage = -100 * nextPosition;
    } else {
      nextPosition = 0;
    }
    this.items.find(i => i.id === 0).marginLeft = finalPercentage;
    this.currentPosition = nextPosition;
  }

  setBack() {
    let finalPercentage = 0;
    let backPosition = this.currentPosition - 1;
    if (backPosition >= 0) {
      finalPercentage = -100 * backPosition;
    } else {
      backPosition = this.items.length - 1;
      finalPercentage = -100 * backPosition;
    }
    this.items.find(i => i.id === 0).marginLeft = finalPercentage;
    this.currentPosition = backPosition;
  }



}
