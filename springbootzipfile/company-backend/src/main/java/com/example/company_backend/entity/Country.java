package com.example.company_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "countries")
public class Country {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;
 private String name;

 // Constructors
 public Country() {}

 public Country(String name) {
     this.name = name;
 }

 // Getters and Setters
 public Long getId() {
     return id;
 }

 public void setId(Long id) {
     this.id = id;
 }

 public String getName() {
     return name;
 }

 public void setName(String name) {
     this.name = name;
 }
}