import { Router } from "express";
import adminController from "../controllers/adminController";
import verificationController from "../controllers/verificationController";
import protectadmin from "../middleware/authAdmin";


const router=Router()
const AdminController=new adminController()
const VerificationController=new verificationController()

router.post('/register',AdminController.signupAdmin.bind(AdminController))
router.post('/otp-verification',VerificationController.adminotpverify.bind(VerificationController))
router.post('/forgotpassword',VerificationController.adminforgotpassword.bind(VerificationController))
router.post('/resetpassword',VerificationController.adminresetpassword.bind(VerificationController))
router.post('/login',VerificationController.adminlogin.bind(VerificationController))
router.get('/patients',protectadmin,AdminController.patients.bind(AdminController))
router.get('/doctors',protectadmin,AdminController.doctors.bind(AdminController))
router.patch('/doctor/:userId/blockUnblock',protectadmin,AdminController.blockUnblockDoctor.bind(AdminController))
router.patch('/patient/:userId/blockUnblock',protectadmin,AdminController.blockUnblockPatient.bind(AdminController))
router.patch('/:userId/verifyDocuments',protectadmin,AdminController.documentsVerify.bind(AdminController))
router.get('/bookingLIst',AdminController.bookingList.bind(AdminController))
router.get('/bookings',AdminController.bookings.bind(AdminController))
router.patch('/updateFee',AdminController.updateFee.bind(AdminController))
router.post('/addExpertise',AdminController.addExpertise.bind(AdminController))
router.get('/expertise',AdminController.expertise.bind(AdminController))
router.patch('/editExpertise',AdminController.editExpertise.bind(AdminController))
export const adminRoutes = router;
