import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './pages/login/login.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AddressComponent } from './pages/address/address.component';

export const routes: Routes = [
 { path: '', component: HomeComponent }  ,
    { path: 'cart', component: CartComponent },
    {path:'login',component:LoginComponent},
    { path: 'product/:id', component: ProductDetailComponent },
    {path:'checkout',component:CheckoutComponent},
    {path:'orders',component:OrderHistoryComponent},
    {path:'profile',component:ProfileComponent},
    {path:'address', component:AddressComponent}
];
