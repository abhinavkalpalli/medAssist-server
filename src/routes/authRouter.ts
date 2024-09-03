import { Router } from "express";
const router = Router();
import protect, { refreshAccessToken } from "../middleware/authMiddleware";
import authController from "../controllers/authController";
import protectadmin, { refreshAccessTokenadmin } from "../middleware/authAdmin";
import protectdoctor, {
  refreshAccessTokenDoctor,
} from "../middleware/authDoctor";
import verificationController from "../controllers/verificationController";
const AuthController = new authController();
const VerificationController = new verificationController();
router.post("/patient/refresh-token", refreshAccessToken);
router.get(
  "/patient",
  protect,
  AuthController.patientAuth.bind(AuthController)
);
router.post("/admin/refresh-token", refreshAccessTokenadmin);
router.get(
  "/admin",
  protectadmin,
  AuthController.adminAuth.bind(AuthController)
);
router.post("/doctor/refresh-token", refreshAccessTokenDoctor);
router.get(
  "/doctor",
  protectdoctor,
  AuthController.doctorAuth.bind(AuthController)
);
router.get(
  "/resendotp",
  VerificationController.otpresend.bind(VerificationController)
);

export const authRoutes = router;
