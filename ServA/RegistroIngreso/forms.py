from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.core.exceptions import ValidationError

class SignupForm(UserCreationForm):
    email = forms.EmailField(required=True)
    username = forms.CharField(required=True)
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Confirm Password', widget=forms.PasswordInput)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise ValidationError("Email already exists")
        return email

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if User.objects.filter(username=username).exists():
            raise ValidationError("Username already exists")
        return username

class LoginForm(AuthenticationForm):
    username = forms.CharField(label='Username or Email')

    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        
        if username and password:
            user = User.objects.filter(email=username).first() or User.objects.filter(username=username).first()
            if user and user.check_password(password):
                self.cleaned_data['username'] = user.username
            else:
                raise forms.ValidationError("Invalid username/email or password")
        
        return super().clean()
