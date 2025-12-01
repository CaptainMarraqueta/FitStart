import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { RegisterPage } from './register.page';

import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';

// -----------------------------
// Mocks para Swiper (componente de plantilla)
// -----------------------------
@Component({
  selector: 'swiper-container',
  template: '<ng-content></ng-content>'
})
class MockSwiperContainer {}

@Component({
  selector: 'swiper-slide',
  template: '<ng-content></ng-content>'
})
class MockSwiperSlide {}

// -----------------------------
// Mock services & helpers
// -----------------------------
class MockAuthService {
  registrar(data: any) {
    return of({ ok: true });
  }
}

const mockNavController = {
  navigateRoot: jasmine.createSpy('navigateRoot'),
  back: jasmine.createSpy('back')
};

const mockAlert = {
  present: jasmine.createSpy('present')
};

const mockAlertController = {
  create: () => Promise.resolve(mockAlert)
};

// Simple MockElementRef para simular containers en tests
class MockElementRef {
  nativeElement: any;
  constructor(native: any = {}) {
    this.nativeElement = native;
  }
}

// -----------------------------
// Spec
// -----------------------------
describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let authService: AuthService;
  let alertCtrl: AlertController;
  let navCtrl: NavController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        FormsModule
      ],
      declarations: [
        RegisterPage,
        MockSwiperContainer,
        MockSwiperSlide
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: NavController, useValue: mockNavController },
        { provide: AlertController, useValue: mockAlertController }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService);
    alertCtrl = TestBed.inject(AlertController);
    navCtrl = TestBed.inject(NavController);

    // Mock ViewChild elements the component expects
    component.swiperEl = new MockElementRef({
      swiper: {
        activeIndex: 0,
        allowTouchMove: true,
        slideNext: jasmine.createSpy('slideNext'),
        slidePrev: jasmine.createSpy('slidePrev')
      }
    }) as unknown as ElementRef;

    component.reglaContainer = new MockElementRef({
      scrollTop: 0,
      clientHeight: 400
    }) as unknown as ElementRef;

    component.reglaPesoContainer = new MockElementRef({
      scrollLeft: 0,
      clientWidth: 400
    }) as unknown as ElementRef;

    // Ensure swiperInstance is set for navigation tests (the component normally sets it on onSwiperReady)
    component.swiperInstance = component.swiperEl.nativeElement.swiper;

    fixture.detectChanges();
  });

  // -----------------------------
  // Tests básicos
  // -----------------------------
  it('debe crearse la página', () => {
    expect(component).toBeTruthy();
  });

  // -----------------------------
  // Validación de slides
  // -----------------------------
  it('validateSlide(0) debe ser true con datos válidos', () => {
    component.usuario = {
      ...component.usuario,
      nombre: 'Juan',
      email: 'test@example.com',
      password: '123456',
      edad: 25,
      genero: 'M'
    };

    expect(component.validateSlide(0)).toBeTrue();
  });

  it('validateSlide(0) debe ser false con datos inválidos', () => {
    component.usuario = {
      ...component.usuario,
      nombre: '',
      email: 'badmail',
      password: '',
      edad: 0,
      genero: ''
    };

    expect(component.validateSlide(0)).toBeFalse();
  });

  it('validateSlide(1) debe validar objetivos y condiciones', () => {
    component.usuario.objetivo = ['bajar_peso'];
    component.usuario.condicion = ['Ninguna'];

    expect(component.validateSlide(1)).toBeTrue();

    component.usuario.objetivo = [];
    expect(component.validateSlide(1)).toBeFalse();
  });

  it('validateSlide(2) y validateSlide(3) verifican rangos', () => {
    component.minAltura = 100;
    component.maxAltura = 250;
    component.usuario.altura = 170;
    expect(component.validateSlide(2)).toBeTrue();
    component.usuario.altura = 50;
    expect(component.validateSlide(2)).toBeFalse();

    component.minPeso = 30;
    component.maxPeso = 150;
    component.usuario.peso = 80;
    expect(component.validateSlide(3)).toBeTrue();
    component.usuario.peso = 500;
    expect(component.validateSlide(3)).toBeFalse();
  });

  // -----------------------------
  // Navegación entre slides (nextSlide / prevSlide)
  // -----------------------------
  describe('navegación swiper', () => {
    it('nextSlide: avanza cuando validateSlide es true', () => {
      // Forzamos validateSlide true
      spyOn(component, 'validateSlide').and.returnValue(true);

      component.nextSlide();

      expect(component.swiperInstance.slideNext).toHaveBeenCalled();
    });

    it('nextSlide: no avanza cuando validateSlide es false', () => {
      spyOn(component, 'validateSlide').and.returnValue(false);
      // spy alert global si se usa (alert)
      spyOn(window, 'alert');

      component.nextSlide();

      expect(component.swiperInstance.slideNext).not.toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalled();
    });

    it('prevSlide: llama slidePrev si activeIndex > 0', () => {
      component.swiperInstance.activeIndex = 1;

      component.prevSlide();

      expect(component.swiperInstance.slidePrev).toHaveBeenCalled();
    });

    it('prevSlide: navega a /login si activeIndex === 0', () => {
      // reset spy call count
      mockNavController.navigateRoot.calls.reset();

      component.swiperInstance.activeIndex = 0;

      component.prevSlide();

      expect(mockNavController.navigateRoot).toHaveBeenCalledWith('/login');
    });
  });

  // -----------------------------
  // Lógica de reglas (altura/peso) - onScroll / scrollToValue / onScrollPeso / scrollToPeso
  // -----------------------------
  describe('reglas (altura y peso)', () => {
    it('onScroll debe actualizar altura basado en scrollTop', () => {
      // Preparar container y parámetros
      component.maxAltura = 300;
      component.minAltura = 0;
      const container = component.reglaContainer.nativeElement;
      // Calcular scrollTop que apunte al valor 170
      // index = maxAltura - value => 300 - 170 = 130
      container.clientHeight = 400;
      container.scrollTop = 130 * 40 - container.clientHeight / 2 + 20; // fórmula usada en scrollToValue

      component.onScroll();

      expect(component.usuario.altura).toBe(170);
      expect(component.alturaActual).toBe(170);
    });

    it('scrollToValue debe establecer scrollTop correctamente', () => {
      component.maxAltura = 300;
      const container = component.reglaContainer.nativeElement;

      component.scrollToValue(170);

      // index = maxAltura - value = 130
      const expected = 130 * 40 - container.clientHeight / 2 + 20;
      // Al no haber cambiado clientHeight en este test, puede ser NaN si no existe; aseguramos que existe
      expect(container.scrollTop).toBe(expected);
    });

    it('onScrollPeso debe actualizar peso basado en scrollLeft', () => {
      component.minPeso = 10;
      component.maxPeso = 300;
      const container = component.reglaPesoContainer.nativeElement;
      container.clientWidth = 400;

      // Queremos que el valor sea 70 => index = 70 - minPeso = 60
      container.scrollLeft = 60 * 40 - container.clientWidth / 2 + 20;

      component.onScrollPeso();

      expect(component.usuario.peso).toBe(70);
    });

    it('scrollToPeso debe establecer scrollLeft correctamente', () => {
      component.minPeso = 10;
      const container = component.reglaPesoContainer.nativeElement;

      component.scrollToPeso(70);

      const expected = (70 - component.minPeso) * 40 - container.clientWidth / 2 + 20;
      expect(container.scrollLeft).toBe(expected);
    });
  });

  // -----------------------------
  // registrarUsuario (éxito y errores)
  // -----------------------------
  describe('registrarUsuario', () => {
    beforeEach(() => {
      // Poner datos válidos por defecto
      component.usuario = {
        nombre: 'Test',
        email: 'test@example.com',
        password: 'password123',
        edad: 25,
        genero: 'M',
        objetivo: ['bajar_peso'],
        condicion: ['Ninguna'],
        altura: 170,
        peso: 75
      };
    });

    it('debe llamar authService.registrar y navegar a /home en success', async () => {
      spyOn(authService, 'registrar').and.returnValue(of({ ok: true }));
      // limpiar spy
      mockAlert.present.calls.reset();
      mockNavController.navigateRoot.calls.reset();

      await component.registrarUsuario();

      expect(authService.registrar).toHaveBeenCalledWith(component.usuario);
      expect(mockAlert.present).toHaveBeenCalled();
      expect(mockNavController.navigateRoot).toHaveBeenCalledWith('/home');
    });

    it('debe mostrar alerta si validación global falla', async () => {
      // Hacer inválidos todos los slides
      component.usuario = {
        nombre: '',
        email: '',
        password: '',
        edad: 0,
        genero: '',
        objetivo: [],
        condicion: [],
        altura: 0,
        peso: 0
      };

      spyOn(alertCtrl, 'create').and.callThrough();
      mockAlert.present.calls.reset();

      await component.registrarUsuario();

      expect(alertCtrl.create).toHaveBeenCalled();
      expect(mockAlert.present).toHaveBeenCalled();
      // No debe llamar a authService.registrar
      expect(authService.registrar).not.toHaveBeenCalled();
    });

    it('debe manejar error de backend y mostrar mensaje por defecto', async () => {
      const err = { error: { error: 'Email already in use' } };
      spyOn(authService, 'registrar').and.returnValue(throwError(() => err));
      spyOn(alertCtrl, 'create').and.callThrough();
      mockAlert.present.calls.reset();

      await component.registrarUsuario();

      expect(authService.registrar).toHaveBeenCalled();
      expect(alertCtrl.create).toHaveBeenCalled();
      expect(mockAlert.present).toHaveBeenCalled();
      // no navega
      expect(mockNavController.navigateRoot).not.toHaveBeenCalled();
    });
  });

});
