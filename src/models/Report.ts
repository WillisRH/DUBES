// models/Report.ts
import mongoose, { Schema, Document } from 'mongoose';

interface ReportDocument extends Document {
    name: string;
    nisn: string;
    physicalPercentage: number;
    mentalPercentage: number;
    bodyScore: number;
    physicalSymptoms: string[];
    mentalSymptoms: string[];
    answers: { [key: string]: number };
    suggestion: string;
    city: string;
    createdAt: Date;
    handled?: boolean;  // Added handled as an optional boolean
}

const ReportSchema = new Schema<ReportDocument>({
    name: { type: String, required: true },
    nisn: { type: String, required: true },
    physicalPercentage: { type: Number, required: true },
    mentalPercentage: { type: Number, required: true },
    bodyScore: { type: Number, required: true },
    physicalSymptoms: { type: [String], required: true },
    mentalSymptoms: { type: [String], required: true },
    answers: { type: Map, of: Number, required: true },
    suggestion: { type: String },
    city: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    handled: { type: Boolean, default: false },  // Added handled with a default value of false
});

const Report = mongoose.models.Report || mongoose.model<ReportDocument>('Report', ReportSchema);
export default Report;
