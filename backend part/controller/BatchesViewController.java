package paymentinitiationbackend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import paymentinitiationbackend.config.JwtTokenUtil;
import paymentinitiationbackend.dto.BatchCardView;
import paymentinitiationbackend.dto.BatchDetailsView;
import paymentinitiationbackend.dto.TransactionRow;
import paymentinitiationbackend.model.Batch;
import paymentinitiationbackend.model.Employee;
import paymentinitiationbackend.repository.BatchRepository;
import paymentinitiationbackend.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import paymentinitiationbackend.dto.UpdateBatchMetaRequest;
import java.time.LocalDateTime;
import java.util.Comparator;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/batches-view")
public class BatchesViewController {

    private final BatchRepository batchRepository;
    private final EmployeeRepository employeeRepository;
    private final JwtTokenUtil jwtTokenUtil;

    public BatchesViewController(BatchRepository batchRepository,
                                 EmployeeRepository employeeRepository,
                                 JwtTokenUtil jwtTokenUtil) {
        this.batchRepository = batchRepository;
        this.employeeRepository = employeeRepository;
        this.jwtTokenUtil=jwtTokenUtil;
    }

    @GetMapping
    public ResponseEntity<List<BatchCardView>> listBatches(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "status", required = false) String statusParam,
            @RequestParam(value = "mine", required = false) String mineParam,
            @RequestParam(value = "currency", required = false) String currencyIgnored,
            HttpServletRequest request
    ) {

        String qNorm = q == null ? "" : q.trim().toLowerCase();
        String statusNorm = normalizeStatus(statusParam);
        boolean mineOnly=mineParam!=null && mineParam.equalsIgnoreCase("true");

        String token=jwtTokenUtil.extractTokenRequest(request);
        String currentUserId=(token!=null && jwtTokenUtil.validateToken(token))
                ?jwtTokenUtil.getUsernameFromToken(token)
                :null;

        List<Batch> all = batchRepository.findAll();

        List<Batch> filtered = all.stream()
                .filter(b -> matchesQuery(b, qNorm))
                .filter(b -> matchesStatus(b, statusNorm))
                .filter(b->!mineOnly || (currentUserId!=null && currentUserId.equals(b.getUserId())))
                .collect(Collectors.toList());

        filtered.sort(
                Comparator.comparing(
                        Batch::getLastPaymentDate,
                        Comparator.nullsLast(Comparator.naturalOrder())
                ).reversed()
                                .thenComparing(
                                        Batch::getId,
                                        Comparator.nullsLast(Comparator.reverseOrder())
                                )
        );

        List<BatchCardView> out = filtered.stream()
                .map(b->toCardView(b,currentUserId))
                .collect(Collectors.toList());

        return ResponseEntity.ok(out);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BatchDetailsView> getBatchDetails(@PathVariable Long id,HttpServletRequest request) {
        Batch batch = batchRepository.findById(id).orElse(null);
        if (batch == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Batch not found with id: " + id);
        }
        String token=jwtTokenUtil.extractTokenRequest(request);
        String currentUserId=(token!=null && jwtTokenUtil.validateToken(token))
                ?jwtTokenUtil.getUsernameFromToken(token)
                :null;

        List<Employee> employees = employeeRepository.findByBatchId(id);
        BatchDetailsView view = toDetailsView(batch, employees,currentUserId);
        return ResponseEntity.ok(view);
    }

//    public static class EmployeePatch{
//        public String employee;
//        public String account;
//        public BigDecimal amount;
//    }

//    @PutMapping("/{batchId}/transactions/{employeeId}")
//    public ResponseEntity<BatchDetailsView> updateTransaction(
//            @PathVariable Long batchId,
//            @PathVariable Long employeeId,
//            @RequestBody EmployeePatch patch,
//            HttpServletRequest request){
//
//        Batch batch=batchRepository.findById(batchId)
//                .orElseThrow(()->new ResponseStatusException(
//                HttpStatus.NOT_FOUND,"Batch not found: "+batchId));
//
//       String user=resolveUserOrThrow(request);
//       if(!isEditable(user,batch)){
//           throw new ResponseStatusException(HttpStatus.FORBIDDEN,"NOT allowed");
//       }
//
//        Employee emp=employeeRepository.findById(employeeId)
//                .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Employee not found:"+employeeId));
//
//       if(emp.getBatch()==null || !Objects.equals(emp.getBatch().getId(),batchId)){
//           throw new ResponseStatusException(HttpStatus.CONFLICT,"Employee does not belong to this batch");
//       }
//
//        if(patch.employee!=null && !patch.employee.trim().isEmpty()){
//            emp.setName(patch.employee.trim());
//        }
//
//        if(patch.account!=null && !patch.account.trim().isEmpty()){
//            emp.setBankDetails(patch.account.trim());
//        }
//
//        if(patch.amount!=null && patch.amount.compareTo(BigDecimal.ZERO)>=0){
//            emp.setSalaryAmount(patch.amount);
//        }
//        employeeRepository.save(emp);
//        List<Employee> employees=employeeRepository.findByBatchId(batch.getId());
//        return ResponseEntity.ok(toDetailsView(batch,employees,user));
//    }
//
//    @DeleteMapping("/{batchId}/transactions/{employeeId}")
//    public ResponseEntity<BatchDetailsView> deleteTransaction(@PathVariable Long batchId,
//                                                              @PathVariable Long employeeId,
//                                                              HttpServletRequest request){
//        Batch batch=batchRepository.findById(batchId)
//                .orElseThrow(()->new ResponseStatusException(
//                        HttpStatus.NOT_FOUND,"Batch not found: "+batchId));
//
//        String user=resolveUserOrThrow(request);
//        if(!isEditable(user,batch)){
//            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"NOT allowed");
//        }
//
//        Employee emp=employeeRepository.findById(employeeId)
//                .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Employee not found:"+employeeId));
//
//        if(emp.getBatch()==null || !Objects.equals(emp.getBatch().getId(),batchId)){
//            throw new ResponseStatusException(HttpStatus.CONFLICT,"Employee does not belong to this batch");
//        }
//
//        employeeRepository.delete(emp);
//        List<Employee> employees=employeeRepository.findByBatchId(batchId);
//        return ResponseEntity.ok(toDetailsView(batch,employees,user));
//    }

    public static class updateBatchMetaRequest{
        public String debitAccount;
        public String currency;
    }

    @PostMapping("/{id}")
    @Transactional
    public ResponseEntity<BatchCardView> updateBatchMeta(@PathVariable Long id,
                                                         @RequestBody UpdateBatchMetaRequest body,
                                                         HttpServletRequest request){
        Batch b=batchRepository.findById(id)
                .orElseThrow(()->new ResponseStatusException(
                        HttpStatus.NOT_FOUND,"Batch not found: "));

                String token=jwtTokenUtil.extractTokenRequest(request);
                String currentUserId=(token!=null && jwtTokenUtil.validateToken(token))
                        ?jwtTokenUtil.getUsernameFromToken(token)
                        :null;

                if(!isEditable(currentUserId,b)){
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Not allowed");
                }
                if(body.getName()!=null && !body.getName().trim().isEmpty()){ b.setName(body.getName().trim());}
                if(body.getDebitAccount()!=null && !body.getDebitAccount().trim().isEmpty()){ b.setDebitAccount(body.getDebitAccount().trim());}
                if(body.getCurrency()!=null && !body.getCurrency().trim().isEmpty()){ b.setCurrency(body.getCurrency().trim());}
                batchRepository.save(b);
                return ResponseEntity.ok(toCardView(b,currentUserId));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteBatchView(@PathVariable Long id,HttpServletRequest request){
        Batch b=batchRepository.findById(id)
                .orElseThrow(()->new ResponseStatusException(
                        HttpStatus.NOT_FOUND,"Batch not found: "));

        String token=jwtTokenUtil.extractTokenRequest(request);
        String currentUserId=(token!=null && jwtTokenUtil.validateToken(token))
                ?jwtTokenUtil.getUsernameFromToken(token)
                :null;

        if(!isEditable(currentUserId,b)){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Not allowed");
        }

        employeeRepository.unassignEmployeesByBatchId(id);
        batchRepository.deleteById(id);
        return ResponseEntity.noContent().build();


    }

    private boolean matchesQuery(Batch b, String qNorm) {
        if (qNorm.isEmpty()) return true;
        String idStr = String.valueOf(b.getId());
        String name = Optional.ofNullable(b.getName()).orElse("");
        return idStr.toLowerCase().contains(qNorm) || name.toLowerCase().contains(qNorm);
    }

    private String resolveUserOrThrow(HttpServletRequest request){
        String token=jwtTokenUtil.extractTokenRequest(request);
        if(token==null || !jwtTokenUtil.validateToken(token)){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid or missing token");
        }

        return jwtTokenUtil.getUsernameFromToken(token);
    }

    private boolean matchesStatus(Batch b, String statusNorm) {
        if (statusNorm == null) return true;
        return toUiStatus(b.getPaymentStatus()).equals(statusNorm);
    }

    private String normalizeStatus(String s) {
        if (s == null || s.isBlank()) return null;
        switch (s.trim().toLowerCase()) {
            case "pending":
                return "pending";
            case "approved":
                return "approved";
            case "rejected":
                return "rejected";
            default:
                return null;

        }
    }

    private String toUiStatus(String dbStatus) {
        if (dbStatus == null) return "";
        switch (dbStatus.trim().toLowerCase()) {
            case "pending":
                return "pending";
            case "approved":
                return "approved";
            case "rejected":
                return "rejected";
            default:
                return dbStatus.trim().toLowerCase();
        }
    }

    private BigDecimal sumSalaries(Long batchId) {
        List<Employee> emps = employeeRepository.findByBatchId(batchId);
        return emps.stream()
                .map(e -> Optional.ofNullable(e.getSalaryAmount()).orElse(BigDecimal.ZERO))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private long countEmployees(Long batchId) {
        return employeeRepository.countByBatchId(batchId);
    }

    private boolean isEditable(String currentUserId,Batch b){
        boolean mine=currentUserId!=null && currentUserId.equals(b.getUserId());
        boolean approved="approved".equalsIgnoreCase(toUiStatus(b.getPaymentStatus()));
        return mine && !approved;
    }

    private BatchCardView toCardView(Batch b,String currentUserId) {
        Long id = b.getId();
        BigDecimal totalAmount = sumSalaries(id);
        long employees = countEmployees(id);

        String uiStatus=toUiStatus(b.getPaymentStatus());
//        boolean isApproved="approved".equalsIgnoreCase(uiStatus);
//        boolean isOwner = currentUserId !=null && currentUserId.equals(b.getUserId());

        BatchCardView v = new BatchCardView();
        v.setId(id);
        v.setName(b.getName());
        v.setStatus(uiStatus);
        v.setEmployees(employees);

        v.setCurrency(Optional.ofNullable(b.getCurrency()).orElse(""));
        v.setCreatedBy(b.getUserId());
        v.setDebitAccount(Optional.ofNullable(b.getDebitAccount()).orElse(""));
        v.setDescription("");

        v.setDate(b.getLastPaymentDate());
        v.setTotalAmountNum(totalAmount);

//        v.setCanEdit(false);
//        v.setCanDelete(false);
//        return v;
        boolean editable=isEditable(currentUserId,b);
        v.setCanEdit(editable);
        v.setCanDelete(editable);
        return v;
    }

    //    private BatchCardView toCardOnly(Batch b,List<Employee> employees){
//        var v=new BatchCardView();
//        v.setId(b.getId());
//        v.setName(b.getName());
//        v.setStatus(b.getPaymentStatus());
//        v.setEmployees(employees!=null ? employees.size():0);
//        v.setCurrency(b.getCurrency());
//        v.setDebitAccount(b.getDebitAccount());
//        v.setDate(b.getLastPaymentDate());
//
//        java.math.BigDecimal total=employees.stream()
//                .map(e->java.util.Optional.ofNullable(e.getSalaryAmount()).orElse(BigDecimal.ZERO))
//                .reduce(BigDecimal.ZERO,java.math.BigDecimal::add);
//        v.setTotalAmountNum(total);
//        return v;
//    }
    private BatchDetailsView toDetailsView(Batch b, List<Employee> employees,String currentUserId) {

        BatchDetailsView v = new BatchDetailsView();

        BigDecimal totalAmount = employees.stream()
                .map(e -> Optional.ofNullable(e.getSalaryAmount()).orElse(BigDecimal.ZERO))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        String uiStatus=toUiStatus(b.getPaymentStatus());
//        boolean isApproved="approved".equalsIgnoreCase(uiStatus);
//        boolean isOwner = currentUserId!=null && currentUserId.equals(b.getUserId());

        v.setId(b.getId());
        v.setName(b.getName());
        v.setStatus(uiStatus);
        v.setEmployees(employees.size());

        v.setCurrency(b.getCurrency());
        v.setCreatedBy(b.getUserId());
        v.setDebitAccount(b.getDebitAccount());
        v.setDate(b.getLastPaymentDate());
        v.setDescription("");

        v.setTotalAmountNum(totalAmount);

//        v.setCanEdit(isOwner && !isApproved);
//        v.setCanDelete(isOwner && !isApproved);
        boolean editable=isEditable(currentUserId,b);
        v.setCanEdit(editable);
        v.setCanDelete(editable);

        List<TransactionRow> rows=employees.stream().map(e->{
            TransactionRow tr = new TransactionRow();
            tr.setDate(b.getLastPaymentDate());
            tr.setId(Optional.ofNullable(e.getPaymentRef()).filter(s->!s.isBlank())
                    .orElse(String.valueOf(e.getId())));
            tr.setEmployee(e.getName());
            tr.setEmployeeId(e.getId());
            tr.setAccount(e.getBankDetails());
            tr.setAmount(e.getSalaryAmount());
            tr.setStatus(uiStatus);
            return tr;
        }).toList();

        v.setTransactions(rows);
        return v;

    }


}
