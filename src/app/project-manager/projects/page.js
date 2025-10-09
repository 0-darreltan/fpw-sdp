// app/project-manager/projects/page.js
'use client'
import { useState } from 'react';
import PMLayout from '../../../components/pm/PMLayout.jsx';

export default function PMProjects() {
  const [projects, setProjects] = useState([
    {
      id: 'PRJ-001',
      name: 'Rumah Keluarga Budi',
      client: 'Budi Santoso',
      type: 'Rumah Tinggal',
      startDate: '2024-01-15',
      deadline: '2024-09-01',
      progress: 25,
      status: 'On Track',
      phase: 'Design & Planning',
      budget: 750000000,
      spent: 187500000,
      team: ['John Doe', 'Jane Smith', 'Bob Wilson'],
      assignedPM: 'Ahmad Fauzi',
      location: 'Jl. Mandonga No. 45, Kendari',
      priority: 'Normal',
      milestones: [
        { name: 'Survey & Analisis', status: 'completed', dueDate: '2024-02-01' },
        { name: 'Desain Arsitektur', status: 'in-progress', dueDate: '2024-03-15' },
        { name: 'Persiapan Konstruksi', status: 'pending', dueDate: '2024-04-01' },
        { name: 'Pelaksanaan Konstruksi', status: 'pending', dueDate: '2024-07-15' }
      ]
    },
    {
      id: 'PRJ-002',
      name: 'Gedung Perkantoran CV. Maju',
      client: 'CV. Maju Bersama',
      type: 'Gedung Perkantoran',
      startDate: '2023-10-01',
      deadline: '2024-12-01',
      progress: 60,
      status: 'On Track',
      phase: 'Construction',
      budget: 7500000000,
      spent: 4500000000,
      team: ['Sarah Johnson', 'Mike Chen', 'David Brown', 'Lisa Wang'],
      assignedPM: 'Siti Nurhaliza',
      location: 'Jl. A.H. Nasution No. 123, Kendari',
      priority: 'High',
      milestones: [
        { name: 'Perencanaan Detail', status: 'completed', dueDate: '2023-11-15' },
        { name: 'Konstruksi Lantai 1-2', status: 'completed', dueDate: '2024-03-01' },
        { name: 'Konstruksi Lantai 3-4', status: 'in-progress', dueDate: '2024-07-01' },
        { name: 'Finishing & Handover', status: 'pending', dueDate: '2024-11-15' }
      ]
    },
    {
      id: 'PRJ-003',
      name: 'Renovasi Toko Sejahtera',
      client: 'Ahmad Rahman',
      type: 'Renovasi',
      startDate: '2024-02-01',
      deadline: '2024-08-15',
      progress: 40,
      status: 'Delayed',
      phase: 'Construction',
      budget: 350000000,
      spent: 140000000,
      team: ['Tom Anderson', 'Emily Davis'],
      assignedPM: 'Rudi Hartono',
      location: 'Jl. Pasar Baru No. 67, Kendari',
      priority: 'Normal',
      milestones: [
        { name: 'Demolisi & Persiapan', status: 'completed', dueDate: '2024-02-15' },
        { name: 'Renovasi Struktur', status: 'in-progress', dueDate: '2024-05-01' },
        { name: 'Interior & Eksterior', status: 'pending', dueDate: '2024-07-01' },
        { name: 'Final Inspection', status: 'pending', dueDate: '2024-08-10' }
      ]
    },
    {
      id: 'PRJ-004',
      name: 'Jembatan Kecil Mandonga',
      client: 'Pemda Kendari',
      type: 'Infrastruktur',
      startDate: '2024-01-01',
      deadline: '2024-07-30',
      progress: 85,
      status: 'On Track',
      phase: 'Finishing',
      budget: 2500000000,
      spent: 2125000000,
      team: ['Alex Turner', 'Maria Garcia', 'Chris Lee'],
      assignedPM: 'Bambang Wijaya',
      location: 'Jl. Trans Sulawesi Km 15, Kendari',
      priority: 'High',
      milestones: [
        { name: 'Survei & Desain', status: 'completed', dueDate: '2024-01-15' },
        { name: 'Konstruksi Fondasi', status: 'completed', dueDate: '2024-03-01' },
        { name: 'Konstruksi Jembatan', status: 'completed', dueDate: '2024-06-01' },
        { name: 'Finishing & Testing', status: 'in-progress', dueDate: '2024-07-25' }
      ]
    }
  ]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPhase, setFilterPhase] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = ['All', 'On Track', 'Delayed', 'At Risk', 'Completed'];
  const phaseOptions = ['All', 'Design & Planning', 'Construction', 'Finishing', 'Completed'];

  const filteredProjects = projects.filter(project => {
    const matchesStatus = filterStatus === 'All' || project.status === filterStatus;
    const matchesPhase = filterPhase === 'All' || project.phase === filterPhase;
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPhase && matchesSearch;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'On Track':
        return 'bg-green-100 text-green-800';
      case 'Delayed':
        return 'bg-red-100 text-red-800';
      case 'At Risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'Design & Planning':
        return 'bg-blue-100 text-blue-800';
      case 'Construction':
        return 'bg-orange-100 text-orange-800';
      case 'Finishing':
        return 'bg-purple-100 text-purple-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low':
        return 'bg-gray-100 text-gray-800';
      case 'Normal':
        return 'bg-blue-100 text-blue-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMilestoneStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateProjectStatus = (projectId, newStatus) => {
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, status: newStatus } : project
    ));
  };

  const updateProjectProgress = (projectId, newProgress) => {
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, progress: Math.min(100, Math.max(0, newProgress)) } : project
    ));
  };

  return (
    <PMLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manajemen Proyek</h1>
              <p className="mt-2 text-gray-600">Kelola semua proyek konstruksi yang sedang berjalan</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Buat Proyek Baru
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari proyek, klien, atau ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterPhase}
              onChange={(e) => setFilterPhase(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {phaseOptions.map(phase => (
                <option key={phase} value={phase}>{phase}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-600">{project.client}</p>
                    <p className="text-xs text-gray-500">{project.id}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-600">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPhaseColor(project.phase)}`}>
                    {project.phase}
                  </span>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <p><strong>PM:</strong> {project.assignedPM}</p>
                  <p><strong>Deadline:</strong> {project.deadline}</p>
                  <p><strong>Budget:</strong> {formatCurrency(project.budget)}</p>
                  <p><strong>Spent:</strong> {formatCurrency(project.spent)} ({Math.round((project.spent / project.budget) * 100)}%)</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Detail
                  </button>
                  <button className="bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors">
                    Update
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-medium text-gray-900">Detail Proyek {selectedProject.id}</h3>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Project Info */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Informasi Proyek</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Nama:</span> {selectedProject.name}</p>
                        <p><span className="font-medium">Client:</span> {selectedProject.client}</p>
                        <p><span className="font-medium">Tipe:</span> {selectedProject.type}</p>
                        <p><span className="font-medium">Lokasi:</span> {selectedProject.location}</p>
                        <p><span className="font-medium">Project Manager:</span> {selectedProject.assignedPM}</p>
                        <p><span className="font-medium">Start Date:</span> {selectedProject.startDate}</p>
                        <p><span className="font-medium">Deadline:</span> {selectedProject.deadline}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Status & Progress</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm">{selectedProject.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-blue-600 h-3 rounded-full" 
                              style={{ width: `${selectedProject.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedProject.status)}`}>
                            {selectedProject.status}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPhaseColor(selectedProject.phase)}`}>
                            {selectedProject.phase}
                          </span>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Update Progress</label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={selectedProject.progress}
                              onChange={(e) => updateProjectProgress(selectedProject.id, parseInt(e.target.value))}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                            <span className="flex items-center text-sm text-gray-500">%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Budget & Keuangan</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Budget:</span>
                          <span className="font-medium">{formatCurrency(selectedProject.budget)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Spent:</span>
                          <span className="font-medium text-orange-600">{formatCurrency(selectedProject.spent)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Remaining:</span>
                          <span className="font-medium text-green-600">{formatCurrency(selectedProject.budget - selectedProject.spent)}</span>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex justify-between">
                            <span>Budget Usage:</span>
                            <span className="font-medium">{Math.round((selectedProject.spent / selectedProject.budget) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-orange-600 h-2 rounded-full" 
                              style={{ width: `${(selectedProject.spent / selectedProject.budget) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Team & Milestones */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Tim Proyek</h4>
                      <div className="space-y-2">
                        {selectedProject.team.map((member, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-xs font-medium">
                                  {member.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <span className="text-sm font-medium">{member}</span>
                            </div>
                            <span className="text-xs text-gray-500">Active</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Milestones</h4>
                      <div className="space-y-3">
                        {selectedProject.milestones.map((milestone, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded">
                            <div className="flex-1">
                              <div className="flex items-center mb-1">
                                <span className="text-sm font-medium text-gray-900">{milestone.name}</span>
                                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMilestoneStatusColor(milestone.status)}`}>
                                  {milestone.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">Due: {milestone.dueDate}</p>
                            </div>
                            <div className="ml-4">
                              {milestone.status === 'completed' && (
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                              {milestone.status === 'in-progress' && (
                                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                              )}
                              {milestone.status === 'pending' && (
                                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Update Status</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status Proyek</label>
                          <div className="flex flex-wrap gap-2">
                            {statusOptions.filter(s => s !== 'All').map(status => (
                              <button
                                key={status}
                                onClick={() => updateProjectStatus(selectedProject.id, status)}
                                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                  selectedProject.status === status 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Tutup
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Generate Report
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    Update Timeline
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