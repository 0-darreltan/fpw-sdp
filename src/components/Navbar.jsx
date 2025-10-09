// components/Navbar.js
'use client'
import { Navbar, Button } from "flowbite-react";

export default function AppNavbar() {
  return (
    <Navbar
      fluid
      rounded
      className="fixed w-full z-50 top-0 bg-white shadow-sm"
    >
      <Navbar.Brand href="#home">
        <span className="self-center text-2xl font-bold whitespace-nowrap text-red-600">
          AGUNG
        </span>
        <span className="self-center text-2xl font-bold whitespace-nowrap text-gray-700 ml-1">
          BETON PRECAST
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href="#home" active>
          Beranda
        </Navbar.Link>
        <Navbar.Link href="#about">Tentang</Navbar.Link>
        <Navbar.Link href="#services">Layanan</Navbar.Link>
        <Navbar.Link href="#order">Pesan</Navbar.Link>
        <Navbar.Link href="#contact">Kontak</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}