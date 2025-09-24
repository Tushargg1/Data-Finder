//package com.example.company_backend.entity;
//
//import jakarta.persistence.*;
//
//@Entity
//@Table(name = "cities")
//public class City {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//    private String name;
//    
//    
//    @Column(name = "country_id")
//    private String countryId;
//
//    // getters & setters
//    public String getCountryId() { return countryId; }
//    public void setCountryId(String countryId) { this.countryId = countryId; }
//
//
//    @ManyToOne
//    @JoinColumn(name = "state_id")
//    private State state;
//
//    // Constructors
//    public City() {}
//
//    public City(String name, State state) {
//        this.name = name;
//        this.state = state;
//    }
//
//    // Getters and Setters
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getName() {
//        return name;
//    }








package com.example.company_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cities")
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;

    @ManyToOne
    @JoinColumn(name = "state_id")
    private State state;
    
    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

    // Constructors
    public City() {}

    public City(String name, State state, Country country) {
        this.name = name;
        this.state = state;
        this.country = country;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public State getState() { return state; }
    public void setState(State state) { this.state = state; }
    
    public Country getCountry() { return country; }
    public void setCountry(Country country) { this.country = country; }
}

//
//    public void setName(String name) {
//        this.name = name;
//    }
//
//    public State getState() {
//        return state;
//    }
//
//    public void setState(State state) {
//        this.state = state;
//    }
//}
