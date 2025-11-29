import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginGuard } from './login.guard';
import { AuthService } from '../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginGuard', () => {
  let guard: LoginGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['estaLogueado']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        LoginGuard,
        { provide: AuthService, useValue: authSpy }
      ]
    });

    guard = TestBed.inject(LoginGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should prevent access if user is logged in', () => {
    authService.estaLogueado.and.returnValue(true);
    spyOn(router, 'navigate');

    const canActivate = guard.canActivate();

    expect(canActivate).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should allow access if user is not logged in', () => {
    authService.estaLogueado.and.returnValue(false);
    spyOn(router, 'navigate');

    const canActivate = guard.canActivate();

    expect(canActivate).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
