package com.apportion.apportion.Service;

import com.apportion.apportion.Model.Entidades.UsuarioEntity;
import com.apportion.apportion.Model.Repositrories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public List<UsuarioEntity> findAll() {
        return repository.findAll();
    }

    public Optional<UsuarioEntity> findById(Long id) {
        return repository.findById(id);
    }

    public UsuarioEntity save(UsuarioEntity user) {
        return repository.save(user);
    }

    public void deletebyId(Long id) {
        repository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
}
