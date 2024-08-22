import Doctor from '../models/doctorModel';
import Admin from '../models/adminModel';

export async function updateAllDoctorFees() {
    const admin = await Admin.findOne();
    if (admin) {
        const { baseFee, Increment } = admin;
        const doctors = await Doctor.find();
        doctors.forEach(async (doctor) => {
            let experienceMultiplier = 0;

            if (doctor.experienceYears >= 2 && doctor.experienceYears < 4) {
                experienceMultiplier = 1;
            } else if (doctor.experienceYears >= 4 && doctor.experienceYears < 6) {
                experienceMultiplier = 2;
            } else if (doctor.experienceYears >= 6 && doctor.experienceYears < 8) {
                experienceMultiplier = 3;
            } else if (doctor.experienceYears >= 8 && doctor.experienceYears < 10) {
                experienceMultiplier = 4;
            } else if (doctor.experienceYears >= 10) {
                experienceMultiplier = 5;
            }

            doctor.Fee = baseFee + (Increment * experienceMultiplier);
            await doctor.save();
        });
    }
}
