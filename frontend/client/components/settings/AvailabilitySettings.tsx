import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  Calendar, 
  Plus, 
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { api } from '@/services/api';

interface TimeSlot {
  start: string;
  end: string;
}

interface UserData {
  tutorSettings?: {
    availability: {
      days: string[];
      timeSlots: TimeSlot[];
    };
  };
}

interface AvailabilitySettingsProps {
  userData: UserData;
  onUpdate: () => void;
}

const AvailabilitySettings: React.FC<AvailabilitySettingsProps> = ({ userData, onUpdate }) => {
  const [availability, setAvailability] = useState({
    days: userData.tutorSettings?.availability?.days || [],
    timeSlots: userData.tutorSettings?.availability?.timeSlots || [],
    autoAcceptBookings: false,
    bufferTime: 15,
    maxBookingsPerDay: 8,
    advanceBookingDays: 14
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const daysOfWeek = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' }
  ];

  const timeOptions = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
    '22:00', '22:30', '23:00', '23:30'
  ];

  const handleDayToggle = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const addTimeSlot = () => {
    const newSlot: TimeSlot = { start: '09:00', end: '10:00' };
    setAvailability(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, newSlot]
    }));
  };

  const updateTimeSlot = (index: number, field: 'start' | 'end', value: string) => {
    setAvailability(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const removeTimeSlot = (index: number) => {
    setAvailability(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (availability.days.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one available day',
        variant: 'destructive',
      });
      return;
    }

    if (availability.timeSlots.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please add at least one time slot',
        variant: 'destructive',
      });
      return;
    }

    // Check for valid time slots
    const invalidSlots = availability.timeSlots.filter(slot => 
      slot.start >= slot.end
    );

    if (invalidSlots.length > 0) {
      toast({
        title: 'Validation Error',
        description: 'End time must be after start time for all slots',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.put('/settings/tutor', {
        availability: {
          days: availability.days,
          timeSlots: availability.timeSlots
        }
      });

      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Availability settings updated successfully',
        });
        onUpdate();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update availability settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalHours = () => {
    return availability.timeSlots.reduce((total, slot) => {
      const start = new Date(`2000-01-01T${slot.start}:00`);
      const end = new Date(`2000-01-01T${slot.end}:00`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return total + hours;
    }, 0);
  };

  const getWeeklyHours = () => {
    return getTotalHours() * availability.days.length;
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        {/* Available Days */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Available Days
            </CardTitle>
            <CardDescription>
              Select the days you are available for teaching
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {daysOfWeek.map((day) => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Switch
                    checked={availability.days.includes(day.value)}
                    onCheckedChange={() => handleDayToggle(day.value)}
                  />
                  <Label className="text-sm">{day.label}</Label>
                </div>
              ))}
            </div>
            
            {availability.days.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {availability.days.map((day) => (
                  <Badge key={day} variant="secondary">
                    {day}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time Slots
            </CardTitle>
            <CardDescription>
              Define your available time slots for each day
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {availability.timeSlots.map((slot, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex items-center gap-2 flex-1">
                  <Select
                    value={slot.start}
                    onValueChange={(value) => updateTimeSlot(index, 'start', value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <span className="text-gray-500">to</span>
                  
                  <Select
                    value={slot.end}
                    onValueChange={(value) => updateTimeSlot(index, 'end', value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {slot.start < slot.end ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>
                          {((new Date(`2000-01-01T${slot.end}:00`).getTime() - 
                             new Date(`2000-01-01T${slot.start}:00`).getTime()) / 
                            (1000 * 60 * 60)).toFixed(1)}h
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span>Invalid</span>
                      </>
                    )}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeTimeSlot(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addTimeSlot}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Time Slot
            </Button>
          </CardContent>
        </Card>

        {/* Booking Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Preferences</CardTitle>
            <CardDescription>
              Configure how students can book your sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Auto-accept Bookings</Label>
                <p className="text-sm text-gray-600">
                  Automatically accept booking requests
                </p>
              </div>
              <Switch
                checked={availability.autoAcceptBookings}
                onCheckedChange={(checked) => 
                  setAvailability(prev => ({ ...prev, autoAcceptBookings: checked }))
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Buffer Time (minutes)</Label>
                <Select
                  value={availability.bufferTime.toString()}
                  onValueChange={(value) => 
                    setAvailability(prev => ({ ...prev, bufferTime: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No buffer</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Max Bookings/Day</Label>
                <Select
                  value={availability.maxBookingsPerDay.toString()}
                  onValueChange={(value) => 
                    setAvailability(prev => ({ ...prev, maxBookingsPerDay: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 sessions</SelectItem>
                    <SelectItem value="4">4 sessions</SelectItem>
                    <SelectItem value="6">6 sessions</SelectItem>
                    <SelectItem value="8">8 sessions</SelectItem>
                    <SelectItem value="10">10 sessions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Advance Booking (days)</Label>
                <Select
                  value={availability.advanceBookingDays.toString()}
                  onValueChange={(value) => 
                    setAvailability(prev => ({ ...prev, advanceBookingDays: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">1 week</SelectItem>
                    <SelectItem value="14">2 weeks</SelectItem>
                    <SelectItem value="21">3 weeks</SelectItem>
                    <SelectItem value="30">1 month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Availability Summary</CardTitle>
            <CardDescription>
              Overview of your weekly availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {availability.days.length}
                </p>
                <p className="text-sm text-gray-600">Available Days</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {availability.timeSlots.length}
                </p>
                <p className="text-sm text-gray-600">Time Slots</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {getTotalHours().toFixed(1)}h
                </p>
                <p className="text-sm text-gray-600">Daily Hours</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {getWeeklyHours().toFixed(1)}h
                </p>
                <p className="text-sm text-gray-600">Weekly Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Availability'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AvailabilitySettings;
