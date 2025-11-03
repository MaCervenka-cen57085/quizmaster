package cz.scrumdojo.quizmaster.workspace;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class WorkspaceControllerTest {

    @Autowired
    private WorkspaceController workspaceController;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    final String title = "TEST_TITLE";

    @Test
    public void getWorkspace() {
        var createdWorkspace = workspaceRepository.save(new Workspace(null, title));
        var result = workspaceController.getWorkspace(createdWorkspace.getGuid()).getBody();

        assertNotNull(result);
        assertNotNull(result.getGuid());
        assertEquals(title, result.getTitle());
    }

    @Test
    public void saveWorkspace() {
        WorkspaceCreateResponse response = workspaceController.saveWorkspace(new Workspace(null, title));
        assertNotNull(response);

        var createdWorkspace = workspaceRepository.findById(response.getGuid());
        assertNotNull(createdWorkspace);
        Workspace workspace = createdWorkspace.get();
        assertNotNull(workspace);
        assertNotNull(workspace.getGuid());
        assertEquals(title, workspace.getTitle());
    }
}
