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
    @GetMapping("/workspace/{guid}")
    public ResponseEntity<Workspace> getWorkspace(@PathVariable String guid) {
        return response(workspaceRepository.findById(guid));
    }

    @Transactional
    @PostMapping("/workspace")
    public WorkspaceCreateResponse saveWorkspace(@RequestBody Workspace workspace) {
        var createdWorkspace = workspaceRepository.save(workspace);
        return new WorkspaceCreateResponse(createdWorkspace.getGuid());
    }

    private <T> ResponseEntity<T> response(Optional<T> entity) {
    return entity
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
    }
}
