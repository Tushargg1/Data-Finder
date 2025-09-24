package com.example.company_backend.controller;

import com.example.company_backend.entity.Country;
import com.example.company_backend.entity.State;
import com.example.company_backend.entity.City;
import com.example.company_backend.repository.CountryRepository;
import com.example.company_backend.repository.StateRepository;
import com.example.company_backend.repository.CityRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class LocationController {

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private StateRepository stateRepository;

    @Autowired
    private CityRepository cityRepository;

    @GetMapping("/countries")
    public List<Country> getAllCountries() {
        return countryRepository.findAll();
    }

    @GetMapping("/states")
    public List<State> getStatesByCountry(@RequestParam Long countryId) {
        return stateRepository.findByCountryId(countryId);
    }

    @GetMapping("/cities")
    public List<City> getCitiesByState(@RequestParam Long stateId) {
        return cityRepository.findByStateId(stateId);
    }
}
