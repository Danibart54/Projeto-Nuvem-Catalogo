package com.gamescatalog.controller;

import com.gamescatalog.dto.GameDTO;
import com.gamescatalog.service.GameService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "*"})
public class GameController {

    private final GameService gameService;

    // ─── CREATE ────────────────────────────────────────────────────────────────
    // POST /api/games
    @PostMapping
    public ResponseEntity<GameDTO.Response> create(@Valid @RequestBody GameDTO.Request request) {
        GameDTO.Response created = gameService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ─── READ ALL ──────────────────────────────────────────────────────────────
    // GET /api/games
    // GET /api/games?search=zelda
    // GET /api/games?genre=RPG
    // GET /api/games?platform=PC
    // GET /api/games?available=true
    @GetMapping
    public ResponseEntity<List<GameDTO.Summary>> findAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String platform,
            @RequestParam(required = false) Boolean available) {

        List<GameDTO.Summary> result;

        if (search != null && !search.isBlank()) {
            result = gameService.search(search);
        } else if (genre != null && !genre.isBlank()) {
            result = gameService.findByGenre(genre);
        } else if (platform != null && !platform.isBlank()) {
            result = gameService.findByPlatform(platform);
        } else if (Boolean.TRUE.equals(available)) {
            result = gameService.findAvailable();
        } else {
            result = gameService.findAll();
        }

        return ResponseEntity.ok(result);
    }

    // ─── READ ONE ──────────────────────────────────────────────────────────────
    // GET /api/games/{id}
    @GetMapping("/{id}")
    public ResponseEntity<GameDTO.Response> findById(@PathVariable Long id) {
        return ResponseEntity.ok(gameService.findById(id));
    }

    // ─── UPDATE ────────────────────────────────────────────────────────────────
    // PUT /api/games/{id}
    @PutMapping("/{id}")
    public ResponseEntity<GameDTO.Response> update(
            @PathVariable Long id,
            @Valid @RequestBody GameDTO.Request request) {
        return ResponseEntity.ok(gameService.update(id, request));
    }

    // ─── DELETE ────────────────────────────────────────────────────────────────
    // DELETE /api/games/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        gameService.delete(id);
        return ResponseEntity.ok(Map.of(
                "message", "Game deleted successfully",
                "id", String.valueOf(id)
        ));
    }

    // ─── REPORT ─────────────────────────────────────────────────────────────────
    // GET /api/games/report  (consumed by Lambda /report)
    @GetMapping("/report")
    public ResponseEntity<Map<String, Object>> getReport() {
        return ResponseEntity.ok(gameService.getReport());
    }
}
