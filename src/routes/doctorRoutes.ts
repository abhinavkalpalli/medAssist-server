import { Router } from "express";
import doctorController from "../controllers/doctorController";
import verificationController from "../controllers/verificationController";
import protectdoctor from "../middleware/authDoctor";

const router = Router();
const DoctorController = new doctorController();
const VerificationController = new verificationController();
router.post("/register", DoctorController.signupDoctor.bind(DoctorController));
router.post(
  "/otp-verification",
  VerificationController.otpverifydoctor.bind(VerificationController)
);
router.post(
  "/forgotpassword",
  VerificationController.forgotpassword.bind(VerificationController)
);
router.post(
  "/resetpassword",
  VerificationController.doctorresetpassword.bind(VerificationController)
);
router.post(
  "/login",
  VerificationController.doctorlogin.bind(VerificationController)
);
router.put(
  "/editDoctor",
  protectdoctor,
  DoctorController.editDoctor.bind(DoctorController)
);
router.put(
  "/uploadDocuments",
  protectdoctor,
  DoctorController.uploadDocuments.bind(DoctorController)
);
router.put(
  "/deleteDocument/:email/:index",
  protectdoctor,
  DoctorController.deleteDocument.bind(DoctorController)
);
router.post(
  "/slotUpdate",
  protectdoctor,
  DoctorController.slotUpdate.bind(DoctorController)
);
router.patch(
  "/slotUpdateDay",
  protectdoctor,
  DoctorController.slotUpdateDay.bind(DoctorController)
);
router.get(
  "/fetchSlots",
  protectdoctor,
  DoctorController.fetchSlots.bind(DoctorController)
);
router.get(
  "/appointments",
  protectdoctor,
  DoctorController.appointments.bind(DoctorController)
);
router.get(
  "/allAppointments",
  protectdoctor,
  DoctorController.allAppointments.bind(DoctorController)
);
router.post(
  "/prescription",
  protectdoctor,
  DoctorController.postPrescription.bind(DoctorController)
);
router.get(
  "/fetchDoctor",
  protectdoctor,
  DoctorController.fetchDoctor.bind(DoctorController)
);
router.get(
  "/patientHistory",
  protectdoctor,
  DoctorController.patientHistory.bind(DoctorController)
);
router.patch(
  "/updateBooking",
  protectdoctor,
  DoctorController.updateBooking.bind(DoctorController)
);

export const doctorRoutes = router;
