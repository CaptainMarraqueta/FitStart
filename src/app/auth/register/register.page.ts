import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from '../../models/usuario'; // <-- Importa la interfaz

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements AfterViewInit {
  @ViewChild('swiperEl', { static: false }) swiperEl!: ElementRef;
  @ViewChild('reglaContainer', { static: false }) reglaContainer!: ElementRef;
  @ViewChild('reglaPesoContainer', { static: false }) reglaPesoContainer!: ElementRef;

  minAltura = 0;
  maxAltura = 300;
  alturaActual: number = 0;

  minPeso = 10;
  maxPeso = 300;
  ticksPeso: number[] = []; 

  usuario: Usuario = {
    nombre: '',
    email: '',
    password: '',
    edad: 0,
    genero: '',
    objetivo: [],   // ahora es array
    condicion: [],  // ahora es array
    altura: 160,
    peso: 70,
  };

  ticks: number[] = [];

  objetivosList = [
    { label: 'Bajar de peso', value: 'bajar_peso', selected: false },
    { label: 'Ganar masa muscular', value: 'ganar_masa', selected: false },
    { label: 'Mantenerme saludable', value: 'salud', selected: false },
    { label: 'Mejorar resistencia', value: 'resistencia', selected: false},
  ];

  condicionesList = [
    { label: 'Diabetes', value: 'Diabetes', selected: false },
    { label: 'Hipertensión', value: 'Hipertension', selected: false },
    { label: 'Ninguna', value: 'Ninguna', selected: false },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}

  ngAfterViewInit() {
    // Altura
    for (let i = this.maxAltura; i >= this.minAltura; i--) {
      this.ticks.push(i);
    }
    setTimeout(() => {
      this.scrollToValue(this.usuario.altura);
    }, 100);

    // Peso
    for (let i = this.minPeso; i <= this.maxPeso; i++) {
      this.ticksPeso.push(i);
    }
    setTimeout(() => {
      this.scrollToPeso(this.usuario.peso);
    }, 100);
  }

  onScroll() {
    const container = this.reglaContainer.nativeElement;
    const centerY = container.scrollTop + container.clientHeight / 2;
    const tickHeight = 40;
    const index = Math.round(centerY / tickHeight);
    const value = this.maxAltura - index;

    if (value >= this.minAltura && value <= this.maxAltura) {
      this.usuario.altura = value;
      this.alturaActual = value;
    }
  }

  // Scroll peso horizontal
onScrollPeso() {
  const container = this.reglaPesoContainer.nativeElement;
  const centerX = container.scrollLeft + container.clientWidth / 2;
  const tickWidth = 40;
  const index = Math.round(centerX / tickWidth);
  const value = this.minPeso + index;

  if (value >= this.minPeso && value <= this.maxPeso) {
    this.usuario.peso = value;
  }
}

  scrollToPeso(value: number) {
    const tickWidth = 40;
    const index = value - this.minPeso;
    const container = this.reglaPesoContainer.nativeElement;
    const offset =
      index * tickWidth - container.clientWidth / 2 + tickWidth / 2;
    container.scrollLeft = offset;
  }

  scrollToValue(value: number) {
    const tickHeight = 40;
    const index = this.maxAltura - value;
    const container = this.reglaContainer.nativeElement;
    const offset =
      index * tickHeight - container.clientHeight / 2 + tickHeight / 2;
    container.scrollTop = offset;
  }

  onObjetivosChange() {
    this.usuario.objetivo = this.objetivosList
      .filter((o) => o.selected)
      .map((o) => o.value);
  }

  onCondicionesChange() {
    this.usuario.condicion = this.condicionesList
      .filter((c) => c.selected)
      .map((c) => c.value);
  }

  nextSlide() {
    const currentIndex = this.swiperEl.nativeElement.swiper.activeIndex;
    if (!this.validateSlide(currentIndex)) {
      alert('Por favor completa todos los campos antes de continuar.');
      return;
    }
    this.swiperEl.nativeElement.swiper.slideNext();
  }

  prevSlide() {
    this.swiperEl.nativeElement.swiper.slidePrev();
  }

  validateSlide(index: number): boolean {
    switch (index) {
      case 0:
        return (
          this.usuario.nombre.trim() !== '' &&
          this.usuario.email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.usuario.email) &&
          this.usuario.password.trim() !== '' &&
          this.usuario.edad > 0 &&
          this.usuario.genero !== ''
        );
      case 1:
        return (
          this.usuario.objetivo.length > 0 &&
          this.usuario.condicion.length > 0
        );
      case 2:
        return (
          this.usuario.altura >= this.minAltura &&
          this.usuario.altura <= this.maxAltura
        );
      case 3:
        return this.usuario.peso >= 10 && this.usuario.peso <= 300;
      default:
        return false;
    }
  }

  
  async registrarUsuario() {
    if (
      !this.validateSlide(0) ||
      !this.validateSlide(1) ||
      !this.validateSlide(2) ||
      !this.validateSlide(3)
    ) {
      const alert = await this.alertCtrl.create({
        header: 'Campos incompletos',
        message: 'Por favor completa todos los campos antes de registrarte.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
    this.authService.registrar(this.usuario).subscribe({
      
      next: async () => {
        const alert = await this.alertCtrl.create({
          header: 'Registro exitoso',
          message: '¡Usuario registrado correctamente!',
          buttons: ['OK'],
        });
        await alert.present();
        this.navCtrl.navigateRoot('/login');
      },
      error: async (err) => {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: err.error?.error || 'No se pudo registrar el usuario',
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }



}