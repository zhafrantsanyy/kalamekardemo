// Nama event custom yang di-dispatch komponen Pengaturan Akun setelah berhasil
// ubah nama/avatar, supaya Navbar ikut refresh tanpa reload manual — pola yang
// sama dengan CART_CHANGED_EVENT di Navbar.js.
export const PROFILE_CHANGED_EVENT = "kalamekar:profile-changed";

export function notifyProfileChanged() {
  window.dispatchEvent(new Event(PROFILE_CHANGED_EVENT));
}
