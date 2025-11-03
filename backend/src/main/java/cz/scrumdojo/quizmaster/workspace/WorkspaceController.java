package cz.scrumdojo.quizmaster.workspace;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class WorkspaceController {

    private final WorkspaceRepository workspaceRepository;

    @Autowired
    public WorkspaceController(
        WorkspaceRepository workspaceRepository) {
        this.workspaceRepository = workspaceRepository;
    }


    @Transactional
    @GetMapping("/q-list/{guid}")
    public ResponseEntity<Workspace> getQuestionList(@PathVariable String guid) {
        return response(workspaceRepository.findById(guid));
    }

    @Transactional
    @PostMapping("/q-list")
    public WorkspaceCreateResponse saveQuestionList(@RequestBody Workspace workspace) {
        var createdWorkspace = workspaceRepository.save(workspace);
        return new WorkspaceCreateResponse(createdWorkspace.getGuid());
    }

    private <T> ResponseEntity<T> response(Optional<T> entity) {
    return entity
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
    }
}
