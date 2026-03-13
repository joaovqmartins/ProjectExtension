package com.apportion.apportion.Controller;

import com.apportion.apportion.Model.Entidades.UsuarioEntity;
import com.apportion.apportion.Service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController
@RequestMapping("/user")
@AllArgsConstructor
public class UsuarioController {

    private final UserService userService;

    @GetMapping
    public List<UsuarioEntity> listar() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioEntity> findById(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public UsuarioEntity create(@RequestBody UsuarioEntity user) {
        return userService.save(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable long id) {
        if (!userService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userService.deletebyId(id);
        return ResponseEntity.noContent().build();
    }
}