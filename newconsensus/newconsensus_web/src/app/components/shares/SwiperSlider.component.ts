import { Component, OnInit, Input } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
    selector: 'newcon-swiper-slider',
    templateUrl: './SwiperSlider.component.html',
})
export class SwiperSlider implements OnInit {

    @Input()
    protected data: any;

    constructor() {
    }

    ngOnInit() {
    }

    public configSwiper: SwiperConfigInterface = {
        direction: 'horizontal',
        slidesPerView: 1,
        keyboard: true,
        mousewheel: false,
        scrollbar: false,
        navigation: { nextEl: '.swiper-button-next2', prevEl: '.swiper-button-prev2' },
        pagination: { el: '.swiper-pagination', type: 'bullets', clickable: true, hideOnClick: false, },
        loop: true,
        spaceBetween: 10,
        watchOverflow: true,
        autoplay: { delay: 8000, stopOnLastSlide: false, reverseDirection: false, disableOnInteraction: false }
    };

    public getHeightNoneListSlider(): string {
        if (this.data.length == 0) {
            return "";
        } else {
            var x = document.getElementById("swiper-slider");
            return x.offsetHeight + "px";
        }
    }
}
