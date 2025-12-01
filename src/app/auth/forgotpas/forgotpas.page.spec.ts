import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ToastController } from '@ionic/angular';
import { ForgotpasPage } from './forgotpas.page';
import emailjs from '@emailjs/browser';
import { FormsModule } from '@angular/forms';
import { EmailJSResponseStatus } from '@emailjs/browser';

describe('ForgotpasPage', () => {
  let component: ForgotpasPage;
  let fixture: ComponentFixture<ForgotpasPage>;
  let toastCtrl: ToastController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotpasPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [ToastController]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotpasPage);
    component = fixture.componentInstance;
    toastCtrl = TestBed.inject(ToastController);
    fixture.detectChanges();
  });

  it('should create the page', () => {
    expect(component).toBeTruthy();
  });

  it('should show toast if email is empty', async () => {
    spyOn(component, 'showToast').and.callThrough();
    component.email = '';
    await component.resetPassword();
    expect(component.showToast).toHaveBeenCalledWith('Por favor, ingresa tu correo');
  });

it('should call emailjs.send when email is provided', async () => {
  spyOn(emailjs, 'send').and.returnValue(Promise.resolve({ status: 200, text: 'OK' } as any));
  component.email = 'test@example.com';
  await component.resetPassword();
  expect(emailjs.send).toHaveBeenCalled();
});

it('should show toast after successful email send', async () => {
  spyOn(emailjs, 'send').and.returnValue(
    Promise.resolve({ status: 200, text: 'OK' } as EmailJSResponseStatus)
  );
  spyOn(component, 'showToast').and.callThrough();
  component.email = 'test@example.com';
  await component.resetPassword();
  expect(component.showToast).toHaveBeenCalledWith('Correo enviado. Revisa tu bandeja de entrada.');
});

  it('should show toast if emailjs.send fails', async () => {
    spyOn(emailjs, 'send').and.returnValue(Promise.reject('error'));
    spyOn(component, 'showToast').and.callThrough();
    component.email = 'test@example.com';
    await component.resetPassword();
    expect(component.showToast).toHaveBeenCalledWith('Ocurrió un error, intenta nuevamente.');
  });
});
