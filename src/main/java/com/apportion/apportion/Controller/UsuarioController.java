package com.apportion.apportion.Controller;

import com.apportion.apportion.Dto.UserResponseDto;
import com.apportion.apportion.Entidades.UsuarioEntity;
import com.apportion.apportion.Repositrories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/User")
@RequiredArgsConstructor
public class UsuarioController {

    private final UserRepository repository;

    public UsuarioController(UserRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<UsuarioEntity> listar()
    {
        return repository.findAll();
    }

    @PostMapping
    public UsuarioEntity Create(@RequestBody UsuarioEntity user)
    {
        return repository.save(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioEntity> BuscarPorId(@PathVariable long id)
    {
        return repository.findById(id)
                .map(usuarioEntity -> ResponseEntity.ok(usuarioEntity))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable long id)
    {
        if(!repository.existsById(id))
        {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
