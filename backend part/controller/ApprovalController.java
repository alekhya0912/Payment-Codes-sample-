package paymentinitiationbackend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import paymentinitiationbackend.dto.ApprovalBatchDto;
import paymentinitiationbackend.dto.ApprovalRequestDto;
import paymentinitiationbackend.dto.ApprovalStatisticsDto;
import paymentinitiationbackend.model.Batch;
import paymentinitiationbackend.model.Employee;
import paymentinitiationbackend.repository.BatchRepository;
import paymentinitiationbackend.repository.EmployeeRepository;
import paymentinitiationbackend.service.ApprovalService;

import java.util.List;

@RestController
@RequestMapping("/api/approvals")
@Tag(name = "Approval Management", description = "APIs for managing payroll batch approvals")
public class ApprovalController {

    private final ApprovalService approvalService;
    private final BatchRepository batchRepository;
    private final EmployeeRepository employeeRepository;

    @Autowired
    public ApprovalController(ApprovalService approvalService,
                              BatchRepository batchRepository,
                              EmployeeRepository employeeRepository) {
        this.approvalService = approvalService;
        this.batchRepository = batchRepository;
        this.employeeRepository = employeeRepository;
    }

    @GetMapping("/pending")
    @Operation(summary = "Get pending batches", description = "Retrieve all batches that are pending approval")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved pending batches",
                    content = @Content(schema = @Schema(implementation = ApprovalBatchDto.class))),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<ApprovalBatchDto>> getPendingBatches() {
        try {
            List<Batch> batches = batchRepository.findAll();
            List<ApprovalBatchDto> pending = batches.stream()
                .filter(b -> b.getPaymentStatus() != null && b.getPaymentStatus().equalsIgnoreCase("Pending"))
                .filter(b -> b.getDebitAccount() != null && !b.getDebitAccount().trim().isEmpty())
                .filter(b -> b.getCurrency() != null && !b.getCurrency().trim().isEmpty())
                .map(this::mapBatchToApprovalDto)
                .toList();
            return ResponseEntity.ok(pending);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/reviewed")
    @Operation(summary = "Get reviewed batches", description = "Retrieve all batches that have been approved or rejected")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved reviewed batches",
                    content = @Content(schema = @Schema(implementation = ApprovalBatchDto.class))),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<ApprovalBatchDto>> getReviewedBatches() {
        try {
            List<Batch> batches = batchRepository.findAll();
            List<ApprovalBatchDto> reviewed = batches.stream()
                .filter(b -> b.getPaymentStatus() != null && (b.getPaymentStatus().equalsIgnoreCase("approved") || b.getPaymentStatus().equalsIgnoreCase("rejected")))
                .map(this::mapBatchToApprovalDto)
                .toList();
            return ResponseEntity.ok(reviewed);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/pending/{id}")
    @Operation(summary = "Get pending batch by ID", description = "Retrieve a specific pending batch by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the batch",
                    content = @Content(schema = @Schema(implementation = ApprovalBatchDto.class))),
        @ApiResponse(responseCode = "404", description = "Batch not found"),
        @ApiResponse(responseCode = "400", description = "Batch is not pending approval")
    })
    public ResponseEntity<ApprovalBatchDto> getPendingBatchById(
            @Parameter(description = "Batch ID", required = true) @PathVariable Long id) {
        try {
            return batchRepository.findById(id)
                .filter(b -> b.getPaymentStatus() != null && b.getPaymentStatus().equalsIgnoreCase("Pending"))
                .map(this::mapBatchToApprovalDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}/approve")
    @Operation(summary = "Approve a batch", description = "Approve a pending batch with authentication")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Batch approved successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request or batch not pending"),
        @ApiResponse(responseCode = "401", description = "Authentication failed"),
        @ApiResponse(responseCode = "404", description = "Batch not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApprovalBatchDto> approveBatch(
            @Parameter(description = "Batch ID", required = true) @PathVariable Long id,
            @RequestBody ApprovalRequestDto approvalRequest) {
        try {
            if (!"approver123".equals(approvalRequest.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            Batch batch = batchRepository.findById(id).orElse(null);
            if (batch == null) return ResponseEntity.notFound().build();
            if (batch.getPaymentStatus() == null || !batch.getPaymentStatus().equalsIgnoreCase("Pending")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
            batch.setPaymentStatus("approved");
            batch.setLastPaymentDate(java.time.LocalDateTime.now());
            batchRepository.save(batch);
            ApprovalBatchDto dto = mapBatchToApprovalDto(batch);
            dto.setApprovedBy(approvalRequest.getApproverName());
            dto.setApprovedDate(java.time.LocalDateTime.now());
            dto.setApprovalComments(approvalRequest.getComments());
            dto.setStatus("approved");
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}/reject")
    @Operation(summary = "Reject a batch", description = "Reject a pending batch with authentication")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Batch rejected successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request or batch not pending"),
        @ApiResponse(responseCode = "401", description = "Authentication failed"),
        @ApiResponse(responseCode = "404", description = "Batch not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApprovalBatchDto> rejectBatch(
            @Parameter(description = "Batch ID", required = true) @PathVariable Long id,
            @RequestBody ApprovalRequestDto approvalRequest) {
        try {
            if (!"approver123".equals(approvalRequest.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            Batch batch = batchRepository.findById(id).orElse(null);
            if (batch == null) return ResponseEntity.notFound().build();
            if (batch.getPaymentStatus() == null || !batch.getPaymentStatus().equalsIgnoreCase("Pending")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
            batch.setPaymentStatus("rejected");
            batch.setLastPaymentDate(java.time.LocalDateTime.now());
            batchRepository.save(batch);
            ApprovalBatchDto dto = mapBatchToApprovalDto(batch);
            dto.setApprovedBy(approvalRequest.getApproverName());
            dto.setApprovedDate(java.time.LocalDateTime.now());
            dto.setApprovalComments(approvalRequest.getComments());
            dto.setStatus("rejected");
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private ApprovalBatchDto mapBatchToApprovalDto(Batch batch) {
        java.util.List<Employee> emps = employeeRepository.findByBatchId(batch.getId());
        java.math.BigDecimal total = emps.stream()
            .map(Employee::getSalaryAmount)
            .filter(java.util.Objects::nonNull)
            .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
        ApprovalBatchDto dto = new ApprovalBatchDto();
        dto.setId(batch.getId());
        dto.setBatchName(batch.getName());
        dto.setCreatedBy("Unknown");
        dto.setCreatedDate(java.time.LocalDateTime.now());
        dto.setStatus(batch.getPaymentStatus() != null ? batch.getPaymentStatus().toLowerCase() : "pending");
        dto.setTotalAmount(total);
        dto.setCurrency(batch.getCurrency());
        dto.setEmployeeCount(emps.size());
        dto.setApproversRequired(1);
        dto.setApproversAssigned(1);
        dto.setDebitAccount(batch.getDebitAccount());
        dto.setDescription(null);
        // approved fields will be set by caller when relevant
        return dto;
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get approval statistics", description = "Get statistics about pending and reviewed batches")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved statistics",
                    content = @Content(schema = @Schema(implementation = ApprovalStatisticsDto.class))),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApprovalStatisticsDto> getApprovalStatistics() {
        try {
            ApprovalStatisticsDto statistics = approvalService.getApprovalStatistics();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
