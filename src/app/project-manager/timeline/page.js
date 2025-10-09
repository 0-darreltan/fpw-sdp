// app/project-manager/timeline/page.js
'use client'
import { useState } from 'react';
import PMLayout from '../../../components/pm/PMLayout.jsx';

export default function PMTimeline() {
  const [selectedProject, setSelectedProject] = useState('PRJ-001');
  const [viewMode, setViewMode] = useState('month'); // day, week, month, year

  const projects = [
    { id: 'PRJ-001', name: 'Rumah Keluarga Budi', color: 'bg-blue-500' },
    { id: 'PRJ-002', name: 'Gedung Perkantoran CV. Maju', color: 'bg-green-500' },
    { id: 'PRJ-003', name: 'Renovasi Toko Sejahtera', color: 'bg-yellow-500' },
    { id: 'PRJ-004', name: 'Jembatan Kecil Mandonga', color: 'bg-purple-500' }
  ];

  const ganttData = {
    'PRJ-001': {
      tasks: [
        {
          id: 1,
          name: 'Survey & Analisis',
          startDate: '2024-01-15',
          endDate: '2024-02-01',
          progress: 100,
          dependencies: [],
          assignee: 'John Doe',
          priority: 'High'
        },
        {
          id: 2,
          name: 'Desain Arsitektur',
          startDate: '2024-02-05',
          endDate: '2024-03-15',
          progress: 75,
          dependencies: [1],
          assignee: 'Jane Smith',
          priority: 'High'
        },
        {
          id: 3,
          name: 'Persiapan Konstruksi',
          startDate: '2024-03-20',
          endDate: '2024-04-01',
          progress: 0,
          dependencies: [2],
          assignee: 'Bob Wilson',
          priority: 'Medium'
        },
        {
          id: 4,
          name: 'Pelaksanaan Konstruksi',
          startDate: '2024-04-05',
          endDate: '2024-07-15',
          progress: 0,
          dependencies: [3],
          assignee: 'Team A',
          priority: 'Critical'
        },
        {
          id: 5,
          name: 'Finishing & Handover',
          startDate: '2024-07-20',
          endDate: '2024-09-01',
          progress: 0,
          dependencies: [4],
          assignee: 'Team B',
          priority: 'Medium'
        }
      ],
      milestones: [
        { name: 'Design Approval', date: '2024-03-15', completed: false },
        { name: 'Construction Start', date: '2024-04-05', completed: false },
        { name: 'Structure Complete', date: '2024-06-01', completed: false },
        { name: 'Project Handover', date: '2024-09-01', completed: false }
      ]
    },
    'PRJ-002': {
      tasks: [
        {
          id: 1,
          name: 'Perencanaan Detail',
          startDate: '2023-10-01',
          endDate: '2023-11-15',
          progress: 100,
          dependencies: [],
          assignee: 'Sarah Johnson',
          priority: 'High'
        },
        {
          id: 2,
          name: 'Konstruksi Lantai 1-2',
          startDate: '2023-11-20',
          endDate: '2024-03-01',
          progress: 100,
          dependencies: [1],
          assignee: 'Mike Chen',
          priority: 'Critical'
        },
        {
          id: 3,
          name: 'Konstruksi Lantai 3-4',
          startDate: '2024-03-05',
          endDate: '2024-07-01',
          progress: 60,
          dependencies: [2],
          assignee: 'David Brown',
          priority: 'Critical'
        },
        {
          id: 4,
          name: 'Finishing & Handover',
          startDate: '2024-07-05',
          endDate: '2024-11-15',
          progress: 0,
          dependencies: [3],
          assignee: 'Lisa Wang',
          priority: 'High'
        }
      ],
      milestones: [
        { name: 'Foundation Complete', date: '2023-12-01', completed: true },
        { name: 'Level 2 Complete', date: '2024-03-01', completed: true },
        { name: 'Level 4 Complete', date: '2024-07-01', completed: false },
        { name: 'Final Handover', date: '2024-11-15', completed: false }
      ]
    }
  };

  const currentProjectData = ganttData[selectedProject] || { tasks: [], milestones: [] };

  // Generate calendar months for timeline
  const generateTimelineMonths = () => {
    const months = [];
    const start = new Date('2023-10-01');
    const end = new Date('2024-12-31');
    
    let current = new Date(start);
    while (current <= end) {
      months.push({
        month: current.getMonth(),
        year: current.getFullYear(),
        name: current.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
      });
      current.setMonth(current.getMonth() + 1);
    }
    return months;
  };

  const timelineMonths = generateTimelineMonths();

  const getTaskPosition = (startDate, endDate) => {
    const timelineStart = new Date('2023-10-01');
    const timelineEnd = new Date('2024-12-31');
    const totalDays = (timelineEnd - timelineStart) / (1000 * 60 * 60 * 24);
    
    const taskStart = new Date(startDate);
    const taskEnd = new Date(endDate);
    
    const startOffset = (taskStart - timelineStart) / (1000 * 60 * 60 * 24);
    const duration = (taskEnd - taskStart) / (1000 * 60 * 60 * 24);
    
    const leftPercent = (startOffset / totalDays) * 100;
    const widthPercent = (duration / totalDays) * 100;
    
    return { left: `${leftPercent}%`, width: `${widthPercent}%` };
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const isOverdue = (endDate, progress) => {
    const today = new Date();
    const end = new Date(endDate);
    return end < today && progress < 100;
  };

  return (
    <PMLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Timeline & Jadwal Proyek</h1>
              <p className="mt-2 text-gray-600">Visualisasi Gantt Chart dan jadwal proyek</p>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Export Timeline
              </button>
            </div>
          </div>
        </div>

        {/* Project Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {currentProjectData.tasks.length}
              </div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {currentProjectData.tasks.filter(t => t.progress === 100).length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {currentProjectData.tasks.filter(t => t.progress > 0 && t.progress < 100).length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {currentProjectData.tasks.filter(t => isOverdue(t.endDate, t.progress)).length}
              </div>
              <div className="text-sm text-gray-600">Overdue</div>
            </div>
          </div>
        </div>

        {/* Gantt Chart */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Gantt Chart</h3>
              <div className="flex gap-2">
                {['day', 'week', 'month', 'year'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 text-sm rounded ${
                      viewMode === mode 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {/* Timeline Header */}
            <div className="flex">
              {/* Task Names Column */}
              <div className="w-80 bg-gray-50 border-r border-gray-200">
                <div className="h-12 bg-gray-100 border-b border-gray-200 flex items-center px-4 font-semibold text-gray-900">
                  Task Name
                </div>
                {currentProjectData.tasks.map((task) => (
                  <div key={task.id} className="h-16 border-b border-gray-200 flex items-center px-4">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${getPriorityColor(task.priority)}`}></div>
                      <div>
                        <div className="font-medium text-gray-900">{task.name}</div>
                        <div className="text-sm text-gray-600">{task.assignee}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline Chart */}
              <div className="flex-1 min-w-[800px]">
                {/* Timeline Header with Months */}
                <div className="h-12 bg-gray-100 border-b border-gray-200 flex">
                  {timelineMonths.map((month, index) => (
                    <div 
                      key={index} 
                      className="flex-1 border-r border-gray-300 flex items-center justify-center text-sm font-medium text-gray-700"
                      style={{ minWidth: '80px' }}
                    >
                      {month.name}
                    </div>
                  ))}
                </div>

                {/* Tasks Timeline */}
                <div className="relative">
                  {currentProjectData.tasks.map((task, index) => (
                    <div key={task.id} className="h-16 border-b border-gray-200 relative">
                      {/* Background grid */}
                      <div className="absolute inset-0 flex">
                        {timelineMonths.map((month, monthIndex) => (
                          <div 
                            key={monthIndex} 
                            className="flex-1 border-r border-gray-100"
                            style={{ minWidth: '80px' }}
                          ></div>
                        ))}
                      </div>

                      {/* Task Bar */}
                      <div className="absolute inset-y-0 flex items-center px-2">
                        <div 
                          className="h-8 rounded relative overflow-hidden"
                          style={getTaskPosition(task.startDate, task.endDate)}
                        >
                          {/* Task Background */}
                          <div className={`h-full ${getPriorityColor(task.priority)} opacity-20`}></div>
                          
                          {/* Progress Bar */}
                          <div 
                            className={`absolute top-0 left-0 h-full ${getProgressColor(task.progress)}`}
                            style={{ width: `${task.progress}%` }}
                          ></div>
                          
                          {/* Task Info */}
                          <div className="absolute inset-0 flex items-center px-2">
                            <span className="text-xs font-medium text-white truncate">
                              {task.progress}%
                            </span>
                          </div>

                          {/* Overdue Indicator */}
                          {isOverdue(task.endDate, task.progress) && (
                            <div className="absolute top-0 right-0 w-2 h-full bg-red-600"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Task Details */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Critical Path */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Path Analysis</h3>
            <div className="space-y-3">
              {currentProjectData.tasks
                .filter(task => task.priority === 'Critical')
                .map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{task.name}</div>
                    <div className="text-sm text-gray-600">{task.assignee}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-red-600">{task.progress}%</div>
                    <div className="text-xs text-gray-500">
                      {formatDate(task.startDate)} - {formatDate(task.endDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Milestones</h3>
            <div className="space-y-3">
              {currentProjectData.milestones.map((milestone, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-3 ${
                      milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <div>
                      <div className="font-medium text-gray-900">{milestone.name}</div>
                      <div className="text-sm text-gray-600">{formatDate(milestone.date)}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    milestone.completed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {milestone.completed ? 'Completed' : 'Pending'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Legend */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span className="text-sm">Critical Priority</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
              <span className="text-sm">High Priority</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
              <span className="text-sm">Medium Priority</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-sm">Low Priority</span>
            </div>
          </div>
        </div>
      </div>
    </PMLayout>
  );
}