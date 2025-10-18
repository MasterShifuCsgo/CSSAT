from rest_framework import serializers
from .models import SiteUser, Task, TaskCompletion, TaskOption, KnowledgeDomain, Badge, UnlockEntry
from django.contrib.auth import authenticate

#-------------------Site data serialization----------------#
class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class TaskOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskOption
        fields = '__all__'

class TaskCompletionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCompletion
        fields = '__all__'

class KnowledgeDomainSerializer(serializers.ModelSerializer):
    class Meta:
        model = KnowledgeDomain
        fields = '__all__'

class UnlockEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = UnlockEntry
        fields = '__all__'

#-----------------User Serialization-----------------------#
class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteUser
        fields = '__all__'
        extra_kwargs = {
            'password': {'required': True}
        }

    def validate(self, attrs):
        email = attrs.get('email', '').strip().lower()
        if SiteUser.objects.filter(email=email).exists():
            raise serializers.ValidationError('User with this email id already exists.')
        return attrs

    def create(self, validated_data):
        user = SiteUser.objects.create_user(**validated_data)
        return user


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteUser
        fields = ('email', 'password')

    def update(self, instance, validated_data):
        password = validated_data.pop('password')
        if password:
            instance.set_password(password)
        instance = super().update(instance, validated_data)
        return instance


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False)

    def validate(self, attrs):
        email = attrs.get('email').lower()
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError("Please give both email and password.")

        if not SiteUser.objects.filter(email=email).exists():
            raise serializers.ValidationError('Email does not exist.')

        user = authenticate(request=self.context.get('request'), email=email,
                            password=password)
        if not user:
            raise serializers.ValidationError("Wrong Credentials.")

        attrs['user'] = user
        return attrs