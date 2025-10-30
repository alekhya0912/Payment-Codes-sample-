package paymentinitiationbackend.repository;
import paymentinitiationbackend.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Find all employees belonging to a specific batch ID
    List<Employee> findByBatchId(Long batchId);

    // --- ADD THIS LINE ---
    long countByBatchId(Long batchId); // Method to count employees by batch ID

    // Custom query to efficiently unassign employees from a batch
    @Modifying
    @Query("UPDATE Employee e SET e.batch = null WHERE e.batch.id = :batchId")
    int unassignEmployeesByBatchId(@Param("batchId") Long batchId);

}