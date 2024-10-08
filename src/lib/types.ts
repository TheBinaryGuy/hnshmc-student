export type StudentFees = {
    TermFee: number | null;
    TotalFee: number | null;
    Fees: {
        FeesIDP: number;
        StudentIDF: number;
        TermID: number;
        TermEntryID: number | null;
        ReceiptDate: Date | null;
        ReceiptAmount: number | null;
        Remarks: string | null;
    }[];
};

export type Student = {
    StudentIDP: number;
    FullName: string | null;
    MobileNo: string | null;
    Email: string | null;
    GenderID: number | null;
    Address: string | null;
    FatherMobileNo: string | null;
    CuurentYearID: number | null;
    GRNNo: string | null;
    AadharNumber: number | null;
    PANNo: string | null;
    ScholarshipAmount: number | null;
    EnrollmenyYear: string | null;
    FeesTypeID: number | null;
    BatchID: number | null;
    Remark1: string | null;
    Remark2: string | null;
    Remark3: string | null;
    Password: string | null;
    OTP: string | null;
    TermFee: number | null;
    TotalFee: number | null;
    DepositRefundable: number | null;
    DepositReceived: number | null;
    ImportRefID: number | null;
    ProfileImage: string | null;
    PassYear1: number | null;
    PassYear2: number | null;
    PassYear3: number | null;
    PassYear4: number | null;
    IsActive: boolean;
    IsDelete: boolean | null;
    EntryBy: number;
    EntryDate: Date;
};

export type PaginatedStudents = {
    students: Pick<Student, 'StudentIDP' | 'FullName' | 'Email'>[];
    nextCursor: string;
};
