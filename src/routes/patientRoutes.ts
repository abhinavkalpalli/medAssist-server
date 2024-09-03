import { Router } from "express";
import patientController from "../controllers/patientController";
import verificationController from "../controllers/verificationController";
import protect from "../middleware/authMiddleware";

const router = Router();
const PatientController = new patientController();
const VerificationController = new verificationController();
router.post(
  "/register",
  PatientController.signupPatient.bind(PatientController)
);
router.post(
  "/otp-verification",
  VerificationController.otpverify.bind(VerificationController)
);
router.post(
  "/forgotpassword",
  VerificationController.forgotpassword.bind(VerificationController)
);
router.post(
  "/resetpassword",
  VerificationController.resetpassword.bind(VerificationController)
);
router.post(
  "/login",
  VerificationController.patientlogin.bind(VerificationController)
);
router.put(
  "/editPatient",
  protect,
  PatientController.editPatient.bind(PatientController)
);
router.get(
  "/doctors",
  protect,
  PatientController.doctors.bind(PatientController)
);
router.get(
  "/bookings",
  protect,
  PatientController.getbookings.bind(PatientController)
);
router.post(
  "/postBooking",
  protect,
  PatientController.postBooking.bind(PatientController)
);
router.get(
  "/:patientId/yourBooking",
  protect,
  PatientController.yourBooking.bind(PatientController)
);
router.get(
  "/cancelAppointment/:id",
  protect,
  PatientController.cancelAppointment.bind(PatientController)
);
router.post(
  "/create-payment",
  PatientController.createPayment.bind(PatientController)
);
router.post(
  "/verify-payment",
  PatientController.verifyPayment.bind(PatientController)
);
router.get(
  "/fetchpatient",
  PatientController.fetchpatient.bind(PatientController)
);
router.patch(
  "/setFavourite",
  PatientController.setFavourite.bind(PatientController)
);
router.post(
  "/postRating",
  PatientController.postRating.bind(PatientController)
);

export const patientRoutes = router;
