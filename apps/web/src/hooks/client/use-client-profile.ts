import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientProfileApi, ClientProfile } from '@/lib/api/client-profile';

export function useClientProfile() {
  const queryClient = useQueryClient();

  // Fetch profile data
  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ['client-profile'],
    queryFn: clientProfileApi.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: clientProfileApi.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['client-profile'], data);
    },
    onError: (error) => {
      console.error('Profile update error:', error);
    },
  });

  // Upload avatar mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: clientProfileApi.uploadAvatar,
    onSuccess: (avatarUrl) => {
      queryClient.setQueryData(['client-profile'], (old: ClientProfile | undefined) => {
        if (!old) return old;
        return {
          ...old,
          avatar: avatarUrl,
        };
      });
    },
    onError: () => {
      console.error('Avatar upload failed');
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: clientProfileApi.changePassword,
    onSuccess: () => {
      console.log('Password changed successfully');
    },
    onError: (error) => {
      console.error('Password change error:', error);
    },
  });

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile: updateProfileMutation.mutate,
    uploadAvatar: uploadAvatarMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    isUploadingAvatar: uploadAvatarMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
  };
}
