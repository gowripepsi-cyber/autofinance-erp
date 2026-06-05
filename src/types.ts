/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  registrationNo: string;
  vin: string;
  engineNo: string;
  fuelType: 'Petrol' | 'Diesel' | 'Electric (EV)' | 'Hybrid';
  purchasePrice: number;
  salePrice: number;
  purchaseDate: string;
  fundingAccount: string;
  sellerDetails: string;
  rcReceived: boolean;
  activeInsurance: boolean;
  image: string;
  status: 'Completed' | 'In Transit';
}

export interface Customer {
  id: string;
  fullName: string;
  fatherName: string;
  phoneNumber: string;
  idNumber: string;
  gender: string;
  address: string;
  city: string;
  pincode: string;
  occupation: string;
  introducerName: string;
  avatar: string;
  panUploaded: boolean;
  utilityBillUploaded: boolean;
  crifScore: number;
  category: 'Prime / Low Risk' | 'Medium Risk' | 'High Risk';
  probability: string;
  registrationDate: string;
  status: 'Completed' | 'In Progress';
}

export interface Loan {
  id: string;
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehicleName: string;
  salePrice: number;
  downPayment: number;
  loanAmount: number;
  tenureMonths: number;
  interestRate: number;
  docFee: number;
  dueStartDate: string;
  emiCalculated: number;
  status: 'Draft' | 'Documents' | 'Review' | 'Approved' | 'Active';
  creditScore: number;
  riskCategory: string;
  defaultInstances: number;
  employmentLength: string;
  dtiRatio: string;
}

export interface Transaction {
  id: string; // #TXN-XXXXX
  customer: string;
  vehicle: string;
  amount: number;
  status: 'Success' | 'Failed' | 'Pending';
  date: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  fullName: string;
  businessName: string;
  address: string;
  mobileNumber: string;
  role?: 'admin' | 'user' | 'demo' | null;
  status: 'Pending' | 'Approved' | 'Suspended';
  subscriptionTier?: 'Free' | 'Basic' | 'Pro' | 'Enterprise';
  subscriptionStatus?: 'Active' | 'Inactive' | 'Trial' | 'Expired';
  subscriptionEndDate?: string;
}


// Initial Data definitions
export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'VEH-001',
    make: 'BMW',
    model: 'M4 Competition',
    year: 2023,
    registrationNo: 'WBS-4Z9C0',
    vin: 'WBS4Z9C0X823145',
    engineNo: 'S58-B30A',
    fuelType: 'Petrol',
    purchasePrice: 72400,
    salePrice: 82000,
    purchaseDate: '2023-10-24',
    fundingAccount: 'Secondary Reserve (...1102)',
    sellerDetails: 'Munich Premium Autos',
    rcReceived: true,
    activeInsurance: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaTwRYF4nGGvEyKAXeQ2TJxh85EwhuOYeA8e67uEzFe3kBYfhP6G0Di6hPLILSq1x-iplCJYGIzaEA-kVQQp7ry0LOGjay68UeV09NQl_Q6MQG1tzYIuDRowxiGnTPHqCnKF2ruLlHRIg80uOl8Cfx6vjiyiCcBzx07AWtQD5lj9bxdaEqLdLF4xojGVims1OgBOgEXEj0PdUk4O3fO0VQy9zrMTOslUwsm6EaZ105HllOTodUt9Fy4CUTYbC6WLsR3Cbn2NFbDw8',
    status: 'Completed'
  },
  {
    id: 'VEH-002',
    make: 'Audi',
    model: 'Q8 e-tron',
    year: 2023,
    registrationNo: 'WA1-VA8F2',
    vin: 'WA1VA8F2D902341',
    engineNo: 'E-EV-300KW',
    fuelType: 'Electric (EV)',
    purchasePrice: 88150,
    salePrice: 97500,
    purchaseDate: '2023-10-22',
    fundingAccount: 'Main Operating Account (...4492)',
    sellerDetails: 'Audi Central NYC',
    rcReceived: true,
    activeInsurance: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaTwRYF4nGGvEyKAXeQ2TJxh85EwhuOYeA8e67uEzFe3kBYfhP6G0Di6hPLILSq1x-iplCJYGIzaEA-kVQQp7ry0LOGjay68UeV09NQl_Q6MQG1tzYIuDRowxiGnTPHqCnKF2ruLlHRIg80uOl8Cfx6vjiyiCcBzx07AWtQD5lj9bxdaEqLdLF4xojGVims1OgBOgEXEj0PdUk4O3fO0VQy9zrMTOslUwsm6EaZ105HllOTodUt9Fy4CUTYbC6WLsR3Cbn2NFbDw8',
    status: 'In Transit'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    fullName: 'Robert Chambers',
    fatherName: 'Arthur Chambers',
    phoneNumber: '9876543210',
    idNumber: '3212 4543 9081',
    gender: 'Male',
    address: 'Apt 4B, 221 Baker Street',
    city: 'New York',
    pincode: '10001',
    occupation: 'Real Estate Developer',
    introducerName: 'Self',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRpgs7Nygdbcs1xdQ8B_-lgFF7YwWBiYcT7OAxmll-BOrzzfXbMfVBg2QR_V-UA4IawO_NH43E8gyH1mqvabtZGhAdhJArm3vFYP2O8G7-6aoCUxpTyMLyhpeb3vUKDsxSFL8iWCVlkPS0uLnMPhNvaZ1lO73DDWQkng7eF8_x-a4auQsiB2QgDgfwFdAb-x-8ax4SQ3Aa5KcboYWA9BCiFGv3rpwXl5_soFqGqKNr7C22JnBymy18UAW-mrOzNE0YChglPd2mz8Y',
    panUploaded: true,
    utilityBillUploaded: true,
    crifScore: 780,
    category: 'Prime / Low Risk',
    probability: '97.2%',
    registrationDate: '2023-10-18',
    status: 'Completed'
  },
  {
    id: 'CUST-002',
    fullName: 'Sarah Jenkins',
    fatherName: 'Edward Jenkins',
    phoneNumber: '9123456780',
    idNumber: '4452 1102 9923',
    gender: 'Female',
    address: '402 Oak Avenue',
    city: 'San Francisco',
    pincode: '94102',
    occupation: 'Corporate Director',
    introducerName: 'CUST-001',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnXlMgq-MzWQYeHX3gSwXiAeOyhJCJFajxyBLbt5h6LJrbcokiI1xIKTkx11x6dzB6e60xFz4wMusC90XCiZNzIACGAbAZm34opExyapApZJoXh1GXN6Lt5L81_QDP6TsQDSSEod4KnO_FrcdcHf1OmvMjNBrtjshh5cBppclgx_Ct1Y3GidN6NtPwtk9fCshfnoEAaEyHfiadiTqvxfYPgGrveA5-cr4AVKSOYaiMgTPH3jlgQFthRlrsxCOzwf9-1Kzw6pQs4hE',
    panUploaded: true,
    utilityBillUploaded: true,
    crifScore: 820,
    category: 'Prime / Low Risk',
    probability: '99.1%',
    registrationDate: '2023-10-22',
    status: 'Completed'
  },
  {
    id: 'CUST-003',
    fullName: 'Alice Thompson',
    fatherName: 'David Thompson',
    phoneNumber: '9456782312',
    idNumber: '8820 4412 1102',
    gender: 'Female',
    address: '88 West End Ave',
    city: 'Boston',
    pincode: '02115',
    occupation: 'Consultant',
    introducerName: 'CUST-002',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnXlMgq-MzWQYeHX3gSwXiAeOyhJCJFajxyBLbt5h6LJrbcokiI1xIKTkx11x6dzB6e60xFz4wMusC90XCiZNzIACGAbAZm34opExyapApZJoXh1GXN6Lt5L81_QDP6TsQDSSEod4KnO_FrcdcHf1OmvMjNBrtjshh5cBppclgx_Ct1Y3GidN6NtPwtk9fCshfnoEAaEyHfiadiTqvxfYPgGrveA5-cr4AVKSOYaiMgTPH3jlgQFthRlrsxCOzwf9-1Kzw6pQs4hE',
    panUploaded: true,
    utilityBillUploaded: false,
    crifScore: 742,
    category: 'Prime / Low Risk',
    probability: '94.2%',
    registrationDate: '2023-10-24',
    status: 'In Progress'
  }
];

export const INITIAL_LOANS: Loan[] = [
  {
    id: 'LN-2023-8842',
    customerId: 'CUST-002',
    customerName: 'Sarah Jenkins',
    vehicleId: 'VEH-002',
    vehicleName: 'Audi Q8 e-tron',
    salePrice: 45000,
    downPayment: 5000,
    loanAmount: 40000,
    tenureMonths: 36,
    interestRate: 4.5,
    docFee: 250,
    dueStartDate: '2023-11-01',
    emiCalculated: 1190.13,
    status: 'Review',
    creditScore: 820,
    riskCategory: 'LOW RISK',
    defaultInstances: 0,
    employmentLength: '4.5 Years',
    dtiRatio: '18.4%'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '#TXN-88219',
    customer: 'Robert Chambers',
    vehicle: '2023 Tesla Model Y',
    amount: 1240.00,
    status: 'Success',
    date: '2023-10-24'
  },
  {
    id: '#TXN-88220',
    customer: 'Sarah Jenkins',
    vehicle: '2024 Ford F-150',
    amount: 980.50,
    status: 'Success',
    date: '2023-10-22'
  },
  {
    id: '#TXN-88221',
    customer: 'Michael Scott',
    vehicle: '2022 Toyota RAV4',
    amount: 640.00,
    status: 'Failed',
    date: '2023-10-21'
  },
  {
    id: '#TXN-88222',
    customer: 'Eleanor Shellstrop',
    vehicle: '2023 Honda Civic',
    amount: 410.00,
    status: 'Pending',
    date: '2023-10-20'
  }
];
