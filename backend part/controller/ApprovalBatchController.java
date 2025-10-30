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
import paymentinitiationbackend.service.ApprovalService;

import java.util.Map;

@RestController
@RequestMapping("/api/approval-batches")
@Tag(name = "Approval Batch Management", description = "APIs for creating and managing approval batches")
public class ApprovalBatchController {

    private final ApprovalService approvalService;

    @Autowired
    public ApprovalBatchController(ApprovalService approvalService) {
        this.approvalService = approvalService;
    }

    @PostMapping("/create/{batchId}")
    @Operation(summary = "Create approval batch", description = "Create an approval batch from a regular batch for payment approval")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Approval batch created successfully",
                    content = @Content(schema = @Schema(implementation = ApprovalBatchDto.class))),
        @ApiResponse(responseCode = "400", description = "Invalid request or batch has no employees"),
        @ApiResponse(responseCode = "409", description = "Approval batch already exists for this batch"),
        @ApiResponse(responseCode = "404", description = "Batch not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApprovalBatchDto> createApprovalBatch(
            @Parameter(description = "Batch ID", required = true) @PathVariable Long batchId,
            @RequestBody Map<String, String> request) {
        try {
            String debitAccount = request.get("debitAccount");
            String description = request.get("description");

            if (debitAccount == null || debitAccount.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            ApprovalBatchDto approvalBatch = approvalService.createApprovalBatch(
                    batchId, 
                    debitAccount.trim(), 
                    description != null ? description.trim() : ""
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(approvalBatch);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            } else if (e.getMessage().contains("already exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            } else if (e.getMessage().contains("no assigned employees")) {
                return ResponseEntity.badRequest().build();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
