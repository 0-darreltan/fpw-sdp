// app/project-manager/team/page.js
'use client'
import { useState } from 'react';
import PMLayout from '../../../components/pm/PMLayout.jsx';

export default function PMTeam() {
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'Ahmad Fauzi',
      role: 'Project Manager',
      email: 'ahmad.fauzi@agungbeton.com',
      phone: '+62 812-3456-7890',
      department: 'Project Management',
      status: 'Active',
      experience: '8 years',
      currentProjects: ['PRJ-001'],
      skills: ['Project Management', 'Construction', 'Leadership', 'Risk Management'],
      workload: 85,
      avatar: 'AF',
      joinDate: '2018-03-15',
      location: 'Kendari, Sulawesi Tenggara'
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      role: 'Senior Project Manager',
      email: 'siti.nurhaliza@agungbeton.com',
      phone: '+62 812-3456-7891',
      department: 'Project Management',
      status: 'Active',
      experience: '12 years',
      currentProjects: ['PRJ-002'],
      skills: ['Project Management', 'Building Design', 'Team Leadership', 'Quality Control'],
      workload: 95,
      avatar: 'SN',
      joinDate: '2014-08-20',
      location: 'Kendari, Sulawesi Tenggara'
    },
    {
      id: 3,
      name: 'John Doe',
      role: 'Site Engineer',
      email: 'john.doe@agungbeton.com',
      phone: '+62 812-3456-7892',
      department: 'Engineering',
      status: 'Active',
      experience: '5 years',
      currentProjects: ['PRJ-001', 'PRJ-003'],
      skills: ['Structural Engineering', 'AutoCAD', 'Site Supervision', 'Quality Assurance'],
      workload: 75,
      avatar: 'JD',
      joinDate: '2021-01-10',
      location: 'Kendari, Sulawesi Tenggara'
    },
    {
      id: 4,
      name: 'Jane Smith',
      role: 'Architect',
      email: 'jane.smith@agungbeton.com',
      phone: '+62 812-3456-7893',
      department: 'Design',
      status: 'Active',
      experience: '7 years',
      currentProjects: ['PRJ-001', 'PRJ-004'],
      skills: ['Architectural Design', 'SketchUp', '3D Modeling', 'Building Codes'],
      workload: 80,
      avatar: 'JS',
      joinDate: '2019-06-15',
      location: 'Kendari, Sulawesi Tenggara'
    },
    {
      id: 5,
      name: 'Bob Wilson',
      role: 'Construction Supervisor',
      email: 'bob.wilson@agungbeton.com',
      phone: '+62 812-3456-7894',
      department: 'Construction',
      status: 'Active',
      experience: '10 years',
      currentProjects: ['PRJ-001'],
      skills: ['Construction Management', 'Safety Management', 'Heavy Equipment', 'Team Coordination'],
      workload: 60,
      avatar: 'BW',
      joinDate: '2016-11-05',
      location: 'Kendari, Sulawesi Tenggara'
    },
    {
      id: 6,
      name: 'Sarah Johnson',
      role: 'Quantity Surveyor',
      email: 'sarah.johnson@agungbeton.com',
      phone: '+62 812-3456-7895',
      department: 'Estimation',
      status: 'Active',
      experience: '6 years',
      currentProjects: ['PRJ-002', 'PRJ-003'],
      skills: ['Cost Estimation', 'Material Planning', 'Budget Control', 'Contract Management'],
      workload: 90,
      avatar: 'SJ',
      joinDate: '2020-02-28',
      location: 'Kendari, Sulawesi Tenggara'
    },
    {
      id: 7,
      name: 'Mike Chen',
      role: 'Electrical Engineer',
      email: 'mike.chen@agungbeton.com',
      phone: '+62 812-3456-7896',
      department: 'Engineering',
      status: 'Active',
      experience: '4 years',
      currentProjects: ['PRJ-002'],
      skills: ['Electrical Systems', 'Power Distribution', 'Automation', 'Safety Systems'],
      workload: 70,
      avatar: 'MC',
      joinDate: '2022-04-12',
      location: 'Kendari, Sulawesi Tenggara'
    },
    {
      id: 8,
      name: 'Emily Davis',
      role: 'Interior Designer',
      email: 'emily.davis@agungbeton.com',
      phone: '+62 812-3456-7897',
      department: 'Design',
      status: 'On Leave',
      experience: '3 years',
      currentProjects: ['PRJ-003'],
      skills: ['Interior Design', 'Space Planning', 'Material Selection', 'Color Theory'],
      workload: 45,
      avatar: 'ED',
      joinDate: '2023-01-20',
      location: 'Kendari, Sulawesi Tenggara'
    }
  ]);

  const [selectedMember, setSelectedMember] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const departments = ['All', 'Project Management', 'Engineering', 'Design', 'Construction', 'Estimation'];
  const statuses = ['All', 'Active', 'On Leave', 'Inactive'];

  const projects = [
    { id: 'PRJ-001', name: 'Rumah Keluarga Budi' },
    { id: 'PRJ-002', name: 'Gedung Perkantoran CV. Maju' },
    { id: 'PRJ-003', name: 'Renovasi Toko Sejahtera' },
    { id: 'PRJ-004', name: 'Jembatan Kecil Mandonga' }
  ];

  const filteredMembers = teamMembers.filter(member => {
    const matchesDepartment = filterDepartment === 'All' || member.department === filterDepartment;
    const matchesStatus = filterStatus === 'All' || member.status === filterStatus;
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getWorkloadColor = (workload) => {
    if (workload >= 90) return 'bg-red-500';
    if (workload >= 75) return 'bg-yellow-500';
    if (workload >= 50) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getDepartmentColor = (department) => {
    switch (department) {
      case 'Project Management':
        return 'bg-blue-100 text-blue-800';
      case 'Engineering':
        return 'bg-green-100 text-green-800';
      case 'Design':
        return 'bg-purple-100 text-purple-800';
      case 'Construction':
        return 'bg-orange-100 text-orange-800';
      case 'Estimation':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : projectId;
  };

  const calculateTeamStats = () => {
    const totalMembers = teamMembers.length;
    const activeMembers = teamMembers.filter(m => m.status === 'Active').length;
    const averageWorkload = teamMembers.reduce((sum, m) => sum + m.workload, 0) / totalMembers;
    const overloadedMembers = teamMembers.filter(m => m.workload >= 90).length;

    return { totalMembers, activeMembers, averageWorkload, overloadedMembers };
  };

  const stats = calculateTeamStats();

  return (
    <PMLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manajemen Tim</h1>
              <p className="mt-2 text-gray-600">Kelola anggota tim dan alokasi sumber daya</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tambah Anggota Tim
            </button>
          </div>
        </div>

        {/* Team Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.totalMembers}</div>
                <div className="text-sm text-gray-600">Total Anggota Tim</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.activeMembers}</div>
                <div className="text-sm text-gray-600">Anggota Aktif</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{Math.round(stats.averageWorkload)}%</div>
                <div className="text-sm text-gray-600">Rata-rata Workload</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.overloadedMembers}</div>
                <div className="text-sm text-gray-600">Overloaded (≥90%)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari anggota tim..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">{member.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                    {member.status}
                  </span>
                </div>

                <div className="mb-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(member.department)}`}>
                    {member.department}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Workload</span>
                    <span className="text-sm text-gray-600">{member.workload}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getWorkloadColor(member.workload)}`}
                      style={{ width: `${member.workload}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <p><strong>Experience:</strong> {member.experience}</p>
                  <p><strong>Current Projects:</strong> {member.currentProjects.length}</p>
                  <p><strong>Email:</strong> {member.email}</p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {skill}
                      </span>
                    ))}
                    {member.skills.length > 3 && (
                      <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        +{member.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Detail
                  </button>
                  <button className="bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors">
                    Assign
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Member Detail Modal */}
        {selectedMember && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-1/2 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-medium text-gray-900">Detail Anggota Tim</h3>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Personal Info */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl font-semibold">{selectedMember.avatar}</span>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900">{selectedMember.name}</h4>
                      <p className="text-gray-600">{selectedMember.role}</p>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-2 ${getStatusColor(selectedMember.status)}`}>
                        {selectedMember.status}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Informasi Kontak</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Email:</span> {selectedMember.email}</p>
                        <p><span className="font-medium">Phone:</span> {selectedMember.phone}</p>
                        <p><span className="font-medium">Location:</span> {selectedMember.location}</p>
                        <p><span className="font-medium">Join Date:</span> {selectedMember.joinDate}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Work Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Department:</span> 
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(selectedMember.department)}`}>
                            {selectedMember.department}
                          </span>
                        </p>
                        <p><span className="font-medium">Experience:</span> {selectedMember.experience}</p>
                        <div>
                          <span className="font-medium">Workload:</span>
                          <div className="flex items-center mt-1">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full ${getWorkloadColor(selectedMember.workload)}`}
                                style={{ width: `${selectedMember.workload}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{selectedMember.workload}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Skills & Projects */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Skills & Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.skills.map((skill, index) => (
                          <span key={index} className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Current Projects ({selectedMember.currentProjects.length})</h4>
                      <div className="space-y-2">
                        {selectedMember.currentProjects.map((projectId, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                            <div>
                              <span className="text-sm font-medium text-gray-900">{getProjectName(projectId)}</span>
                              <p className="text-xs text-gray-500">{projectId}</p>
                            </div>
                            <span className="text-xs text-green-600 font-medium">Active</span>
                          </div>
                        ))}
                        {selectedMember.currentProjects.length === 0 && (
                          <p className="text-sm text-gray-500 text-center py-4">No active projects</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Projects Completed:</span>
                          <span className="text-sm font-medium">15</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">On-time Delivery Rate:</span>
                          <span className="text-sm font-medium text-green-600">92%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Quality Score:</span>
                          <span className="text-sm font-medium text-blue-600">4.7/5.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Team Rating:</span>
                          <span className="text-sm font-medium text-yellow-600">⭐⭐⭐⭐⭐</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Tutup
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Edit Profile
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    Assign to Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add New Member Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-1/2 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-medium text-gray-900">Tambah Anggota Tim Baru</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role/Posisi</label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                      <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        {departments.filter(d => d !== 'All').map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                      <input type="text" placeholder="e.g., 5 years" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills (pisahkan dengan koma)</label>
                    <textarea 
                      rows="3" 
                      placeholder="Project Management, Construction, Leadership"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                    <input type="text" placeholder="Kendari, Sulawesi Tenggara" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </form>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Batal
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Tambah Anggota
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PMLayout>
  );
}