package paymentinitiationbackend.repository;

import paymentinitiationbackend.model.ApprovalBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApprovalBatchRepository extends JpaRepository<ApprovalBatch, Long> {

    /**
     * Find all approval batches by approval status
     */
    List<ApprovalBatch> findByApprovalStatus(String approvalStatus);

    /**
     * Find all reviewed batches (approved or rejected)
     */
    @Query("SELECT ab FROM ApprovalBatch ab WHERE ab.approvalStatus IN ('approved', 'rejected')")
    List<ApprovalBatch> findReviewedBatches();

    /**
     * Find approval batch by batch ID
     */
    ApprovalBatch findByBatchId(Long batchId);

    /**
     * Check if approval batch exists for a given batch ID
     */
    boolean existsByBatchId(Long batchId);

    /**
     * Count approval batches by status
     */
    long countByApprovalStatus(String approvalStatus);

    /**
     * Find approval batches by status and currency
     */
    List<ApprovalBatch> findByApprovalStatusAndCurrency(String approvalStatus, String currency);

    /**
     * Find approval batches created by a specific user
     */
    List<ApprovalBatch> findByCreatedBy(String createdBy);

    /**
     * Find approval batches within a date range
     */
    @Query("SELECT ab FROM ApprovalBatch ab WHERE ab.createdDate BETWEEN :startDate AND :endDate")
    List<ApprovalBatch> findByCreatedDateBetween(@Param("startDate") java.time.LocalDateTime startDate, 
                                                @Param("endDate") java.time.LocalDateTime endDate);
}
