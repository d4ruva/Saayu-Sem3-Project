from django.db import models

'''
Brand,Model,Mobile Weight,RAM,Front Camera,Back Camera,Processor,Battery Capacity,Screen Size,Price,Launched Year

'''

# Create your models here.
class Mobile(models.Model):
    brand = models.CharField(max_length=30)
    model = models.CharField(max_length=30)
    main_camera = models.CharField(max_length=52)
    sim_card = models.CharField(max_length=10)
    screen_size = models.CharField(max_length=20)
    battery = models.IntegerField()
    storage = models.IntegerField()
    ram = models.IntegerField()
    self_cam = models.IntegerField()
    price = models.IntegerField()
    display = models.CharField(max_length=15, default="Amoled")

    def __str__(self): 
        return self.model
